import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../core/api_client.dart';
import '../widgets/common_widgets.dart';

class ResourceListScreen extends StatefulWidget {
  const ResourceListScreen(
      {required this.api,
      required this.endpoint,
      required this.title,
      required this.icon,
      super.key});
  final ApiClient api;
  final String endpoint;
  final String title;
  final IconData icon;

  @override
  State<ResourceListScreen> createState() => _ResourceListScreenState();
}

class _ResourceListScreenState extends State<ResourceListScreen> {
  late Future<dynamic> data = _load();

  Future<dynamic> _load() => widget.api.request('GET', widget.endpoint);
  String date(Object? value) {
    final parsed = DateTime.tryParse('$value');
    return parsed == null
        ? '$value'
        : DateFormat('dd/MM/yyyy HH:mm').format(parsed.toLocal());
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<dynamic>(
        future: data,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done)
            return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError)
            return ErrorView(
                message: snapshot.error.toString(),
                retry: () => setState(() => data = _load()));
          final raw = snapshot.data;
          final items = (raw is Map ? raw['items'] : raw) as List? ?? [];
          if (items.isEmpty)
            return EmptyState(
                'Nenhum registro em ${widget.title.toLowerCase()}.');
          return RefreshIndicator(
            onRefresh: () async => setState(() => data = _load()),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text(widget.title,
                    style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 12),
                ...items.map((item) {
                  final map = item as Map;
                  return Card(
                    child: ListTile(
                      leading: Icon(widget.icon),
                      title: Text(
                          '${map['cliente']?['nome'] ?? map['atendimento']?['agendamento']?['cliente']?['nome'] ?? map['formaPagamento'] ?? 'Registro'}'),
                      subtitle: Text(
                        widget.endpoint == '/agendamento'
                            ? '${map['servico']?['nome'] ?? 'Serviço'} · ${date(map['dataHoraReserva'])}'
                            : '${map['formaPagamento'] ?? 'Pagamento'} · R\$ ${map['valorFinal'] ?? '0,00'}',
                      ),
                      trailing: Text('${map['status'] ?? ''}'),
                    ),
                  );
                }),
              ],
            ),
          );
        },
      );
}
