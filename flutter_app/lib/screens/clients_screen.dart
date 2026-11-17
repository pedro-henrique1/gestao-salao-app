import 'package:flutter/material.dart';

import '../core/api_client.dart';
import '../widgets/common_widgets.dart';

class ClientsScreen extends StatefulWidget {
  const ClientsScreen({required this.api, super.key});
  final ApiClient api;

  @override
  State<ClientsScreen> createState() => _ClientsScreenState();
}

class _ClientsScreenState extends State<ClientsScreen> {
  final name = TextEditingController();
  final phone = TextEditingController();
  final email = TextEditingController();
  final search = TextEditingController();
  late Future<dynamic> clients = _load();
  String? editing;

  Future<dynamic> _load() async {
    final result = await widget.api.request('GET', '/cliente',
        query: search.text.isEmpty ? null : {'nome': search.text});
    return result is Map ? result['items'] ?? [] : result;
  }

  @override
  void dispose() {
    name.dispose();
    phone.dispose();
    email.dispose();
    search.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (name.text.trim().isEmpty ||
        phone.text.replaceAll(RegExp(r'\D'), '').length < 10) {
      _message('Informe nome e telefone com DDD.');
      return;
    }
    try {
      final body = {
        'nome': name.text.trim(),
        'telefone': phone.text.replaceAll(RegExp(r'\D'), ''),
        if (email.text.trim().isNotEmpty) 'email': email.text.trim(),
      };
      await widget.api.request(editing == null ? 'POST' : 'PATCH',
          editing == null ? '/cliente' : '/cliente/$editing',
          body: body);
      _clear();
      setState(() => clients = _load());
      _message('Cliente salvo com sucesso.');
    } catch (error) {
      _message(error.toString().replaceFirst('Exception: ', ''));
    }
  }

  void _clear() {
    name.clear();
    phone.clear();
    email.clear();
    editing = null;
  }

  void _message(String text) =>
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Text(editing == null ? 'Novo cliente' : 'Editar cliente',
                      style: Theme.of(context).textTheme.titleLarge),
                  TextField(
                      controller: name,
                      decoration:
                          const InputDecoration(labelText: 'Nome completo')),
                  const SizedBox(height: 8),
                  TextField(
                      controller: phone,
                      keyboardType: TextInputType.phone,
                      decoration: const InputDecoration(
                          labelText: 'Telefone (WhatsApp)')),
                  const SizedBox(height: 8),
                  TextField(
                      controller: email,
                      decoration: const InputDecoration(
                          labelText: 'E-mail (opcional)')),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                          child: FilledButton(
                              onPressed: _save,
                              child: Text(editing == null
                                  ? 'Cadastrar cliente'
                                  : 'Salvar alterações'))),
                      if (editing != null)
                        IconButton(
                            onPressed: () => setState(_clear),
                            icon: const Icon(Icons.close)),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          TextField(
              controller: search,
              onChanged: (_) => setState(() => clients = _load()),
              decoration: const InputDecoration(
                  prefixIcon: Icon(Icons.search),
                  labelText: 'Buscar por nome')),
          const SizedBox(height: 8),
          FutureBuilder<dynamic>(
            future: clients,
            builder: (context, snapshot) {
              if (!snapshot.hasData)
                return const Center(child: CircularProgressIndicator());
              final items = (snapshot.data as List).cast<Map>();
              if (items.isEmpty)
                return const EmptyState('Nenhum cliente encontrado.');
              return Column(
                children: items.map((item) {
                  return Card(
                    child: ListTile(
                      title: Text('${item['nome']}'),
                      subtitle: Text(
                          '${item['telefone'] ?? ''} ${item['email'] ?? ''}'),
                      trailing: IconButton(
                        icon: const Icon(Icons.edit),
                        onPressed: () => setState(() {
                          editing = '${item['id']}';
                          name.text = '${item['nome']}';
                          phone.text = '${item['telefone'] ?? ''}';
                          email.text = '${item['email'] ?? ''}';
                        }),
                      ),
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ],
      );
}
