import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../core/api_client.dart';
import '../widgets/common_widgets.dart';

class CashScreen extends StatefulWidget {
  const CashScreen({required this.api, super.key});
  final ApiClient api;

  @override
  State<CashScreen> createState() => _CashScreenState();
}

class _CashScreenState extends State<CashScreen> {
  late Future<List<Map>> appointments = _loadAppointments();
  late Future<List<Map>> attendances = _loadAttendances();
  late Future<List<Map>> payments = _loadPayments();

  Future<List<Map>> _loadAppointments() async {
    final result = await widget.api
        .request('GET', '/agendamento', query: {'status': 'PENDENTE'});
    final today = DateTime.now();
    return ((result as Map)['items'] as List).cast<Map>().where((item) {
      final date = DateTime.tryParse('${item['dataHoraReserva']}');
      return date != null &&
          date.year == today.year &&
          date.month == today.month &&
          date.day == today.day;
    }).toList();
  }

  Future<List<Map>> _loadAttendances() async {
    final result = await widget.api
        .request('GET', '/atendimento', query: {'semPagamento': 'true'});
    return ((result as Map)['items'] as List).cast<Map>();
  }

  Future<List<Map>> _loadPayments() async {
    final result = await widget.api.request('GET', '/pagamento');
    return ((result as Map)['items'] as List).cast<Map>();
  }

  void _reload() => setState(() {
        appointments = _loadAppointments();
        attendances = _loadAttendances();
        payments = _loadPayments();
      });

  Future<void> _registerAttendance(Map item) async {
    try {
      await widget.api
          .request('POST', '/atendimento', body: {'agendamentoId': item['id']});
      _reload();
      _message('Atendimento baixado com sucesso.');
    } catch (error) {
      _message(_error(error));
    }
  }

  Future<void> _registerPayment(Map item) async {
    final controller = TextEditingController(
        text: '${item['agendamento']?['servico']?['precoPadrao'] ?? ''}');
    var method = 'PIX';
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Receber pagamento'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                  controller: controller,
                  keyboardType: TextInputType.number,
                  decoration:
                      const InputDecoration(labelText: 'Valor final (R\$)')),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                value: method,
                decoration:
                    const InputDecoration(labelText: 'Forma de pagamento'),
                items: const [
                  DropdownMenuItem(value: 'PIX', child: Text('PIX')),
                  DropdownMenuItem(value: 'CARTAO', child: Text('Cartão')),
                  DropdownMenuItem(value: 'DINHEIRO', child: Text('Dinheiro')),
                ],
                onChanged: (value) =>
                    setDialogState(() => method = value ?? 'PIX'),
              ),
            ],
          ),
          actions: [
            TextButton(
                onPressed: () => Navigator.pop(dialogContext, false),
                child: const Text('Cancelar')),
            FilledButton(
                onPressed: () => Navigator.pop(dialogContext, true),
                child: const Text('Confirmar')),
          ],
        ),
      ),
    );
    final value = double.tryParse(controller.text.replaceAll(',', '.'));
    controller.dispose();
    if (confirmed != true || value == null || value <= 0) return;
    try {
      await widget.api.request('POST', '/pagamento', body: {
        'atendimentoId': item['id'],
        'valorFinal': value,
        'formaPagamento': method,
      });
      _reload();
      _message('Pagamento registrado com sucesso.');
    } catch (error) {
      _message(_error(error));
    }
  }

  String _money(Object? value) =>
      NumberFormat.currency(locale: 'pt_BR', symbol: 'R\$')
          .format(num.tryParse('$value') ?? 0);
  String _error(Object? error) => '$error'.replaceFirst('Exception: ', '');
  void _message(String text) =>
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));

  @override
  Widget build(BuildContext context) => ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Operação do caixa',
              style: Theme.of(context).textTheme.headlineSmall),
          const Text('Dê baixa nos atendimentos e registre os recebimentos.'),
          const SizedBox(height: 20),
          const SectionTitle('1 · Atendimentos de hoje'),
          FutureBuilder<List<Map>>(
            future: appointments,
            builder: (context, snapshot) => _items(
              snapshot,
              empty: 'Nenhum atendimento pendente para hoje.',
              builder: (item) => ListTile(
                leading: const Icon(Icons.play_circle_outline),
                title: Text(
                    '${item['cliente']?['nome'] ?? 'Cliente'} · ${item['servico']?['nome'] ?? 'Serviço'}'),
                subtitle: Text('${item['servico']?['precoPadrao'] ?? ''}'),
                trailing: FilledButton(
                    onPressed: () => _registerAttendance(item),
                    child: const Text('Dar baixa')),
              ),
            ),
          ),
          const SizedBox(height: 20),
          const SectionTitle('2 · Aguardando pagamento'),
          FutureBuilder<List<Map>>(
            future: attendances,
            builder: (context, snapshot) => _items(
              snapshot,
              empty: 'Nenhum atendimento aguardando pagamento.',
              builder: (item) => ListTile(
                leading: const Icon(Icons.point_of_sale),
                title: Text(
                    '${item['agendamento']?['cliente']?['nome'] ?? 'Cliente'}'),
                subtitle: Text(
                    '${item['agendamento']?['servico']?['nome'] ?? 'Serviço'}'),
                trailing: FilledButton(
                    onPressed: () => _registerPayment(item),
                    child: const Text('Receber')),
              ),
            ),
          ),
          const SizedBox(height: 20),
          const SectionTitle('Últimos pagamentos'),
          FutureBuilder<List<Map>>(
            future: payments,
            builder: (context, snapshot) => _items(
              snapshot,
              empty: 'Nenhum pagamento registrado.',
              builder: (item) => ListTile(
                leading: const Icon(Icons.check_circle_outline),
                title: Text(
                    '${item['atendimento']?['agendamento']?['cliente']?['nome'] ?? 'Cliente'}'),
                subtitle: Text('${item['formaPagamento'] ?? ''}'),
                trailing: Text(_money(item['valorFinal'])),
              ),
            ),
          ),
        ],
      );

  Widget _items(
    AsyncSnapshot<List<Map>> snapshot, {
    required String empty,
    required Widget Function(Map item) builder,
  }) {
    if (snapshot.connectionState != ConnectionState.done)
      return const Center(child: CircularProgressIndicator());
    if (snapshot.hasError) return Text(_error(snapshot.error));
    final items = snapshot.data ?? [];
    if (items.isEmpty) return EmptyState(empty);
    return Column(
        children: items.map((item) => Card(child: builder(item))).toList());
  }
}
