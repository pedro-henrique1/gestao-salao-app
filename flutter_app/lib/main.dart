import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'core/api_client.dart';
import 'core/app_theme.dart';
import 'screens/home_shell.dart';
import 'screens/login_screen.dart';
import 'screens/client_home_shell.dart';

void main() => runApp(const SalonApp());

class SalonApp extends StatefulWidget {
  const SalonApp({super.key});

  @override
  State<SalonApp> createState() => _SalonAppState();
}

class _SalonAppState extends State<SalonApp> {
  ApiClient? api;

  @override
  void initState() {
    super.initState();
    SharedPreferences.getInstance().then((preferences) {
      if (mounted) setState(() => api = ApiClient(preferences));
    });
  }

  @override
  Widget build(BuildContext context) {
    final client = api;
    if (client == null) {
      return const MaterialApp(
        home: Scaffold(body: Center(child: CircularProgressIndicator())),
      );
    }

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Gestão de Salão',
      theme: appTheme,
      home: client.token == null
          ? LoginScreen(api: client)
          : client.isClient
              ? ClientHomeShell(api: client)
              : HomeShell(api: client),
    );
  }
}
