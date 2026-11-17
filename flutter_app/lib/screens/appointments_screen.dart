import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../core/api_client.dart';
import '../widgets/common_widgets.dart';

class AppointmentsScreen extends StatefulWidget {
  const AppointmentsScreen({required this.api, super.key});
  final ApiClient api;

  @override
  State<AppointmentsScreen> createState() => _AppointmentsScreenState();
}

class _AppointmentsScreenState extends State<AppointmentsScreen> {
  late Future<List<Map>> appointments = _load();

  Future<List<Map>> _load() async {
    final result = await widget.api
        .request('GET', '/agendamento', query: {'status': 'PENDENTE'});
    return ((result as Map)['items'] as List).cast<Map>();
  }

  Future<void> _openNew() async {
    final data = await Future.wait([
      widget.api.request('GET', '/cliente'),
      widget.api.request('GET', '/profissional'),
      widget.api.request('GET', '/servico'),
    ]);
    if (!mounted) return;
    final clients = ((data[0] as Map)['items'] as List).cast<Map>();
    final professionals = ((data[1] as Map)['items'] as List).cast<Map>();
    final services = ((data[2] as Map)['items'] as List).cast<Map>();
    if (clients.isEmpty || professionals.isEmpty || services.isEmpty) {
      _message('Cadastre clientes, profissionais e serviços antes de agendar.');
      return;
    }

    Map client = clients.first;
    Map professional = professionals.first;
    Map service = services.first;
    var date = DateTime.now().add(const Duration(days: 1));
    date = DateTime(date.year, date.month, date.day, 9);
    final result = await showDialog<DateTime>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          insetPadding:
              const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(9),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.calendar_month_outlined,
                  color: Theme.of(context).colorScheme.onPrimaryContainer,
                ),
              ),
              const SizedBox(width: 12),
              const Expanded(child: Text('Novo agendamento')),
            ],
          ),
          content: ConstrainedBox(
            constraints: BoxConstraints(
              maxWidth: 360,
              maxHeight: MediaQuery.sizeOf(context).height * .52,
            ),
            child: SingleChildScrollView(
              physics: const ClampingScrollPhysics(),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _select('Cliente', clients, client,
                      (value) => setDialogState(() => client = value)),
                  _select('Profissional', professionals, professional,
                      (value) => setDialogState(() => professional = value)),
                  _select('Serviço', services, service,
                      (value) => setDialogState(() => service = value)),
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text('Data e horário'),
                    subtitle: Text(DateFormat('dd/MM/yyyy HH:mm').format(date)),
                    trailing: const Icon(Icons.edit_calendar),
                    onTap: () async {
                      final pickedDate = await showDatePicker(
                        context: context,
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 365)),
                        initialDate: date,
                      );
                      if (pickedDate == null || !context.mounted) return;
                      final pickedTime = await showTimePicker(
                        context: context,
                        initialTime: TimeOfDay.fromDateTime(date),
                      );
                      if (pickedTime != null) {
                        setDialogState(() => date = DateTime(
                              pickedDate.year,
                              pickedDate.month,
                              pickedDate.day,
                              pickedTime.hour,
                              pickedTime.minute,
                            ));
                      }
                    },
                  ),
                ],
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogContext),
              child: const Text('Voltar'),
            ),
            FilledButton(
              onPressed: () => Navigator.pop(dialogContext, date),
              child: const Text('Confirmar'),
            ),
          ],
        ),
      ),
    );
    if (result == null) return;
    try {
      await widget.api.request('POST', '/agendamento', body: {
        'clienteId': client['id'],
        'profissionalId': professional['id'],
        'servicoId': service['id'],
        'dataHoraReserva': result.toUtc().toIso8601String(),
      });
      _reload();
      _message('Agendamento marcado com sucesso.');
    } catch (error) {
      _message(_error(error));
    }
  }

  Widget _select(String label, List<Map> items, Map selected,
      ValueChanged<Map> onChanged) {
    return DropdownButtonFormField<String>(
      value: '${selected['id']}',
      isExpanded: true,
      decoration: InputDecoration(labelText: label),
      items: items
          .map((item) => DropdownMenuItem(
              value: '${item['id']}',
              child: Text(
                '${item['nome']}',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              )))
          .toList(),
      onChanged: (value) {
        if (value != null)
          onChanged(items.firstWhere((item) => '${item['id']}' == value));
      },
    );
  }

  Future<void> _cancel(Map item) async {
    try {
      await widget.api.request('PATCH', '/agendamento/${item['id']}/cancelar');
      _reload();
      _message('Agendamento cancelado.');
    } catch (error) {
      _message(_error(error));
    }
  }

  String _date(Object? value) {
    final parsed = DateTime.tryParse('$value');
    return parsed == null
        ? 'Horário não informado'
        : DateFormat('dd/MM/yyyy · HH:mm').format(parsed.toLocal());
  }

  String _error(Object? error) => '$error'.replaceFirst('Exception: ', '');
  void _message(String text) =>
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));

  void _reload() {
    if (!mounted) return;
    setState(() {
      appointments = _load();
    });
  }

  Future<void> _refresh() async {
    _reload();
    await appointments;
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<List<Map>>(
        future: appointments,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done)
            return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError)
            return ErrorView(message: _error(snapshot.error), retry: _reload);
          final items = snapshot.data ?? [];
          return RefreshIndicator(
            onRefresh: _refresh,
            child: ListView(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 28),
              children: [
                Text(
                  'Agenda do salão',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.w700,
                      ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Organize os próximos horários da sua equipe.',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: 18),
                _summaryCard(context, items.length),
                const SizedBox(height: 22),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Próximos horários',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.w700,
                            ),
                      ),
                    ),
                    FilledButton.icon(
                      onPressed: _openNew,
                      icon: const Icon(Icons.add, size: 18),
                      label: const Text('Marcar'),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                if (items.isEmpty)
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 28),
                      child: Column(
                        children: [
                          Icon(
                            Icons.event_available_outlined,
                            size: 42,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          const SizedBox(height: 10),
                          const Text('Nenhum horário pendente.'),
                          const SizedBox(height: 4),
                          Text(
                            'Toque em “Marcar” para criar um agendamento.',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                  )
                else
                  ...items.map((item) => _appointmentCard(context, item)),
              ],
            ),
          );
        },
      );

  Widget _summaryCard(BuildContext context, int count) => Card(
        elevation: 0,
        color: Theme.of(context).colorScheme.primaryContainer,
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Row(
            children: [
              CircleAvatar(
                radius: 25,
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Theme.of(context).colorScheme.onPrimary,
                child: const Icon(Icons.event_note_outlined),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$count ${count == 1 ? 'agendamento pendente' : 'agendamentos pendentes'}',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                          ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      'Confira os detalhes antes de iniciar o atendimento.',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );

  Widget _appointmentCard(BuildContext context, Map item) {
    final client = '${item['cliente']?['nome'] ?? 'Cliente'}';
    final service = '${item['servico']?['nome'] ?? 'Serviço'}';
    final professional = '${item['profissional']?['nome'] ?? 'Profissional'}';
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 14, 8, 12),
        child: Column(
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor:
                      Theme.of(context).colorScheme.secondaryContainer,
                  child: Icon(
                    Icons.person_outline,
                    color: Theme.of(context).colorScheme.onSecondaryContainer,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        client,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style:
                            Theme.of(context).textTheme.titleMedium?.copyWith(
                                  fontWeight: FontWeight.w700,
                                ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        service,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                PopupMenuButton<String>(
                  onSelected: (value) {
                    if (value == 'cancelar') _cancel(item);
                  },
                  itemBuilder: (_) => const [
                    PopupMenuItem(
                      value: 'cancelar',
                      child: Text('Cancelar agendamento'),
                    ),
                  ],
                ),
              ],
            ),
            const Divider(height: 22),
            Row(
              children: [
                const Icon(Icons.person_pin_outlined, size: 18),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    professional,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const Icon(Icons.schedule_outlined, size: 18),
                const SizedBox(width: 6),
                Text(
                  _date(item['dataHoraReserva']),
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
