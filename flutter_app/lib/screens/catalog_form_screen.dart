import 'package:flutter/material.dart';

import '../core/api_client.dart';

enum CatalogType { professional, service }

class CatalogFormScreen extends StatefulWidget {
  const CatalogFormScreen({required this.api, required this.type, super.key});
  final ApiClient api;
  final CatalogType type;

  @override
  State<CatalogFormScreen> createState() => _CatalogFormScreenState();
}

class _CatalogFormScreenState extends State<CatalogFormScreen> {
  late final Map<String, TextEditingController> fields;
  bool busy = false;
  bool get professional => widget.type == CatalogType.professional;

  @override
  void initState() {
    super.initState();
    final keys = professional
        ? ['nome', 'telefone', 'especialidade']
        : ['nome', 'descricao', 'precoPadrao', 'duracaoMinutos'];
    fields = {for (final key in keys) key: TextEditingController()};
  }

  @override
  void dispose() {
    for (final controller in fields.values) controller.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final body = <String, dynamic>{};
    for (final entry in fields.entries) {
      if (entry.value.text.trim().isNotEmpty)
        body[entry.key] = entry.value.text.trim();
    }
    if (!professional) {
      body['precoPadrao'] =
          double.tryParse('${body['precoPadrao'] ?? ''}'.replaceAll(',', '.'));
      body['duracaoMinutos'] = int.tryParse('${body['duracaoMinutos']}');
    }
    setState(() => busy = true);
    try {
      await widget.api.request(
          'POST', professional ? '/profissional' : '/servico',
          body: body);
      for (final controller in fields.values) controller.clear();
      _message('Cadastro realizado com sucesso.');
    } catch (error) {
      _message(error.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  void _message(String text) =>
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(professional ? 'Novo profissional' : 'Novo serviço',
              style: Theme.of(context).textTheme.headlineSmall),
          Text(professional
              ? 'Adicione profissionais e suas especialidades.'
              : 'Defina serviços, preços e duração.'),
          const SizedBox(height: 20),
          for (final entry in fields.entries)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: TextField(
                controller: entry.value,
                keyboardType: entry.key == 'duracaoMinutos'
                    ? TextInputType.number
                    : TextInputType.text,
                decoration: InputDecoration(labelText: _label(entry.key)),
              ),
            ),
          FilledButton(
              onPressed: busy ? null : _save,
              child: busy
                  ? const CircularProgressIndicator()
                  : Text(professional
                      ? 'Cadastrar profissional'
                      : 'Cadastrar serviço')),
        ],
      );

  String _label(String key) => switch (key) {
        'nome' => professional ? 'Nome do profissional' : 'Nome do serviço',
        'telefone' => 'Telefone',
        'especialidade' => 'Especialidade',
        'descricao' => 'Descrição (opcional)',
        'precoPadrao' => 'Preço padrão (R\$)',
        _ => 'Duração (minutos)',
      };
}
