import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../core/api_client.dart';
import '../widgets/common_widgets.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({required this.api, super.key});
  final ApiClient api;

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late Future<dynamic> data = _load();

  Future<dynamic> _load() => widget.api.request('GET', '/dashboard');

  String money(Object? value) =>
      NumberFormat.currency(locale: 'pt_BR', symbol: 'R\$')
          .format(num.tryParse('$value') ?? 0);
  String date(Object? value) {
    final parsed = DateTime.tryParse('$value');
    return parsed == null
        ? 'Horário não informado'
        : DateFormat('dd/MM · HH:mm').format(parsed.toLocal());
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<dynamic>(
        future: data,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done)
            return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError)
            return ErrorView(
                message:
                    snapshot.error.toString().replaceFirst('Exception: ', ''),
                retry: () => setState(() => data = _load()));
          final map = snapshot.data as Map<String, dynamic>;
          final metrics =
              (map['indicadores'] as Map?)?.cast<String, dynamic>() ?? {};
          final upcoming = (map['proximosAgendamentos'] as List?) ?? [];
          return RefreshIndicator(
            onRefresh: () async => setState(() => data = _load()),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                Text('Bom trabalho, gerente',
                    style: Theme.of(context).textTheme.headlineSmall),
                const SizedBox(height: 4),
                Text('Aqui está o resumo da operação do seu salão.',
                    style: Theme.of(context).textTheme.bodyLarge),
                const SizedBox(height: 16),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.6,
                  children: [
                    MetricCard(
                        label: 'Faturamento no mês',
                        value: money(metrics['faturamentoMes'])),
                    MetricCard(
                        label: 'Atendimentos realizados',
                        value: '${metrics['atendimentosMes'] ?? 0}'),
                    MetricCard(
                        label: 'Agendamentos no mês',
                        value: '${metrics['agendamentosMes'] ?? 0}'),
                    MetricCard(
                        label: 'Clientes ativos',
                        value: '${metrics['clientesAtivos'] ?? 0}'),
                  ],
                ),
                const SizedBox(height: 24),
                const SectionTitle('Próximos agendamentos'),
                if (upcoming.isEmpty)
                  const EmptyState('Nenhum agendamento próximo.')
                else
                  ...upcoming.take(8).map((item) {
                    final appointment = item as Map;
                    final client =
                        (appointment['cliente'] as Map?)?['nome'] ?? 'Cliente';
                    final service =
                        (appointment['servico'] as Map?)?['nome'] ?? 'Serviço';
                    final professional =
                        (appointment['profissional'] as Map?)?['nome'] ??
                            'Profissional';
                    return Card(
                      child: ListTile(
                        leading: const CircleAvatar(
                            child: Icon(Icons.event_outlined)),
                        title: Text('$client · $service'),
                        subtitle: Text(
                            '$professional · ${date(appointment['dataHoraReserva'])}'),
                        trailing: const Icon(Icons.chevron_right),
                      ),
                    );
                  }),
              ],
            ),
          );
        },
      );
}
