import 'package:flutter/material.dart';

import '../core/api_client.dart';
import 'catalog_form_screen.dart';
import 'clients_screen.dart';
import 'appointments_screen.dart';
import 'cash_screen.dart';
import 'dashboard_screen.dart';
import 'login_screen.dart';

class HomeShell extends StatefulWidget {
  const HomeShell({required this.api, super.key});
  final ApiClient api;

  @override
  State<HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<HomeShell> {
  int index = 0;
  final labels = const [
    'Visão geral',
    'Clientes',
    'Profissionais',
    'Serviços',
    'Agendamentos',
    'Caixa'
  ];
  final icons = const [
    Icons.dashboard_outlined,
    Icons.people_outline,
    Icons.badge_outlined,
    Icons.spa_outlined,
    Icons.calendar_month_outlined,
    Icons.payments_outlined
  ];
  final bottomIndexes = const [0, 1, 4, 5];

  @override
  Widget build(BuildContext context) {
    final pages = [
      DashboardScreen(api: widget.api),
      ClientsScreen(api: widget.api),
      CatalogFormScreen(api: widget.api, type: CatalogType.professional),
      CatalogFormScreen(api: widget.api, type: CatalogType.service),
      AppointmentsScreen(api: widget.api),
      CashScreen(api: widget.api),
    ];

    return Scaffold(
      appBar: AppBar(
        titleSpacing: 20,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Gestão de Salão',
                style: Theme.of(context).textTheme.titleMedium),
            Text(labels[index], style: Theme.of(context).textTheme.bodySmall),
          ],
        ),
        actions: [
          IconButton(
              onPressed: () => setState(() {}),
              icon: const Icon(Icons.refresh),
              tooltip: 'Atualizar'),
          IconButton(
              onPressed: _logout,
              icon: const Icon(Icons.logout),
              tooltip: 'Sair'),
        ],
      ),
      drawer: _buildDrawer(context),
      body: IndexedStack(index: index, children: pages),
      bottomNavigationBar: NavigationBar(
        selectedIndex:
            bottomIndexes.contains(index) ? bottomIndexes.indexOf(index) : 0,
        onDestinationSelected: (value) =>
            setState(() => index = bottomIndexes[value]),
        destinations: [
          for (final item in bottomIndexes)
            NavigationDestination(icon: Icon(icons[item]), label: labels[item]),
        ],
      ),
    );
  }

  Drawer _buildDrawer(BuildContext context) => Drawer(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 24, 24, 20),
                child: Row(
                  children: [
                    const CircleAvatar(
                      radius: 25,
                      child: Text('GS',
                          style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Painel administrativo',
                            style: Theme.of(context).textTheme.labelMedium),
                        Text('Área do gerente',
                            style: Theme.of(context).textTheme.titleMedium),
                      ],
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              for (var i = 0; i < labels.length; i++)
                ListTile(
                  leading: Icon(icons[i]),
                  title: Text(labels[i]),
                  selected: index == i,
                  onTap: () {
                    Navigator.pop(context);
                    setState(() => index = i);
                  },
                ),
              const Spacer(),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Icons.logout),
                title: const Text('Sair da conta'),
                onTap: _logout,
              ),
            ],
          ),
        ),
      );

  Future<void> _logout() async {
    await widget.api.clearToken();
    if (mounted) {
      Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => LoginScreen(api: widget.api)));
    }
  }
}
