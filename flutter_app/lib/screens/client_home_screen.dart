import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../core/api_client.dart';
import '../widgets/common_widgets.dart';

class ClientHomeScreen extends StatefulWidget {
  const ClientHomeScreen(
      {required this.api, required this.showAppointments, super.key});
  final ApiClient api;
  final bool showAppointments;

  @override
  State<ClientHomeScreen> createState() => _ClientHomeScreenState();
}

class _ClientHomeScreenState extends State<ClientHomeScreen> {
  late Future<List<Map>> catalog = _loadCatalog();
  late Future<List<Map>> appointments = _loadAppointments();

  Future<List<Map>> _loadCatalog() async {
    final results = await Future.wait([
      widget.api.request('GET', '/servico'),
      widget.api.request('GET', '/profissional'),
    ]);
    final services = ((results[0] as Map)['items'] as List).cast<Map>();
    final professionals = ((results[1] as Map)['items'] as List).cast<Map>();
    return [
      for (final service in services)
        {
          'service': service,
          'professionals': professionals,
        },
    ];
  }

  Future<List<Map>> _loadAppointments() async {
    final result = await widget.api.request('GET', '/agendamento/me');
    return ((result as Map)['items'] as List).cast<Map>();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.showAppointments) return _appointmentsView();
    return _catalogView();
  }

  Widget _catalogView() => FutureBuilder<List<Map>>(
        future: catalog,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done)
            return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError)
            return ErrorView(
                message: _error(snapshot.error),
                retry: () => setState(() => catalog = _loadCatalog()));
          final items = snapshot.data ?? [];
          if (items.isEmpty)
            return const EmptyState('Nenhum serviço disponível no momento.');
          return RefreshIndicator(
            onRefresh: () async => setState(() => catalog = _loadCatalog()),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text('Encontre seu próximo serviço',
                    style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 4),
                const Text(
                    'Escolha um serviço e solicite um horário com nossa equipe.'),
                const SizedBox(height: 16),
                ...items.map((item) {
                  final service = item['service'] as Map;
                  return Card(
                    child: ListTile(
                      leading:
                          const CircleAvatar(child: Icon(Icons.spa_outlined)),
                      title: Text('${service['nome']}'),
                      subtitle: Text(
                          '${service['descricao'] ?? 'Serviço do salão'} · ${service['duracaoMinutos'] ?? 0} min'),
                      trailing: Text(_money(service['precoPadrao'])),
                      onTap: () => _schedule(
                          service, (item['professionals'] as List).cast<Map>()),
                    ),
                  );
                }),
              ],
            ),
          );
        },
      );

  Widget _appointmentsView() => FutureBuilder<List<Map>>(
        future: appointments,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done)
            return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError)
            return ErrorView(
                message: _error(snapshot.error),
                retry: () =>
                    setState(() => appointments = _loadAppointments()));
          final items = snapshot.data ?? [];
          if (items.isEmpty)
            return const EmptyState('Você ainda não possui agendamentos.');
          return RefreshIndicator(
            onRefresh: () async =>
                setState(() => appointments = _loadAppointments()),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text('Meus agendamentos',
                    style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 12),
                ...items.map((item) {
                  final service = item['servico'] as Map?;
                  final professional = item['profissional'] as Map?;
                  return Card(
                    child: ListTile(
                      leading: const Icon(Icons.event_available),
                      title: Text('${service?['nome'] ?? 'Serviço'}'),
                      subtitle: Text(
                          '${professional?['nome'] ?? 'Profissional'} · ${_date(item['dataHoraReserva'])}'),
                      trailing: Text('${item['status'] ?? ''}'),
                    ),
                  );
                }),
              ],
            ),
          );
        },
      );

  Future<void> _schedule(Map service, List<Map> professionals) async {
    if (professionals.isEmpty) {
      _message('Nenhum profissional disponível para agendamento.');
      return;
    }
    Map professional = professionals.first;
    DateTime selected = DateTime.now().add(const Duration(days: 1));
    selected = DateTime(selected.year, selected.month, selected.day, 9);

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: Text('Agendar ${service['nome']}'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                value: '${professional['id']}',
                decoration: const InputDecoration(labelText: 'Profissional'),
                items: professionals
                    .map((item) => DropdownMenuItem(
                        value: '${item['id']}', child: Text('${item['nome']}')))
                    .toList(),
                onChanged: (value) {
                  final selectedProfessional = professionals
                      .firstWhere((item) => '${item['id']}' == value);
                  setDialogState(() => professional = selectedProfessional);
                },
              ),
              const SizedBox(height: 12),
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Data e horário'),
                subtitle: Text(_date(selected.toIso8601String())),
                trailing: const Icon(Icons.edit_calendar),
                onTap: () async {
                  final date = await showDatePicker(
                      context: context,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                      initialDate: selected);
                  if (date == null || !context.mounted) return;
                  final time = await showTimePicker(
                      context: context,
                      initialTime: TimeOfDay.fromDateTime(selected));
                  if (time != null)
                    setDialogState(() => selected = DateTime(date.year,
                        date.month, date.day, time.hour, time.minute));
                },
              ),
            ],
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(dialogContext, false),
                child: const Text('Cancelar')),
            FilledButton(
                onPressed: () => Navigator.pop(dialogContext, true),
                child: const Text('Solicitar')),
          ],
        ),
      ),
    );
    if (confirmed != true) return;
    try {
      await widget.api.request('POST', '/agendamento/me', body: {
        'profissionalId': professional['id'],
        'servicoId': service['id'],
        'dataHoraReserva': selected.toUtc().toIso8601String(),
      });
      setState(() => appointments = _loadAppointments());
      _message('Agendamento solicitado com sucesso.');
    } catch (error) {
      _message(_error(error));
    }
  }

  String _money(Object? value) =>
      NumberFormat.currency(locale: 'pt_BR', symbol: 'R\$')
          .format(num.tryParse('$value') ?? 0);
  String _date(Object? value) => DateFormat('dd/MM/yyyy HH:mm')
      .format(DateTime.tryParse('$value')?.toLocal() ?? DateTime.now());
  String _error(Object? error) => '$error'.replaceFirst('Exception: ', '');
  void _message(String text) =>
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));
}
