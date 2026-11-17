import 'package:flutter/material.dart';

import '../core/api_client.dart';
import 'client_home_screen.dart';
import 'login_screen.dart';

class ClientHomeShell extends StatefulWidget {
  const ClientHomeShell({required this.api, super.key});
  final ApiClient api;

  @override
  State<ClientHomeShell> createState() => _ClientHomeShellState();
}

class _ClientHomeShellState extends State<ClientHomeShell> {
  int index = 0;

  @override
  Widget build(BuildContext context) => Scaffold(
        appBar: AppBar(
          title: Text(index == 0 ? 'Serviços' : 'Meus agendamentos'),
          actions: [
            IconButton(
                onPressed: _logout,
                icon: const Icon(Icons.logout),
                tooltip: 'Sair'),
          ],
        ),
        body: ClientHomeScreen(api: widget.api, showAppointments: index == 1),
        bottomNavigationBar: NavigationBar(
          selectedIndex: index,
          onDestinationSelected: (value) => setState(() => index = value),
          destinations: const [
            NavigationDestination(
                icon: Icon(Icons.spa_outlined), label: 'Serviços'),
            NavigationDestination(
                icon: Icon(Icons.calendar_month_outlined),
                label: 'Agendamentos'),
          ],
        ),
      );

  Future<void> _logout() async {
    await widget.api.clearToken();
    if (mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => LoginScreen(api: widget.api)),
      );
    }
  }
}
