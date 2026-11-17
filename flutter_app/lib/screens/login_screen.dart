import 'package:flutter/material.dart';

import '../core/api_client.dart';
import 'client_home_shell.dart';
import 'home_shell.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({required this.api, super.key});
  final ApiClient api;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController();
  final password = TextEditingController();
  final name = TextEditingController();
  final phone = TextEditingController();
  bool registering = false;
  bool registeringClient = true;
  bool busy = false;

  @override
  void dispose() {
    email.dispose();
    password.dispose();
    name.dispose();
    phone.dispose();
    super.dispose();
  }

  Future<void> submit() async {
    final validEmail =
        RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(email.text.trim());
    final missingClientData = registeringClient &&
        (name.text.trim().length < 2 ||
            phone.text.replaceAll(RegExp(r'\D'), '').length < 10);
    if (!validEmail ||
        (registering && (password.text.length < 8 || missingClientData))) {
      _message(registering
          ? 'Informe um e-mail válido e uma senha com pelo menos 8 caracteres.'
          : 'Informe um e-mail válido.');
      return;
    }
    setState(() => busy = true);
    try {
      if (registering) {
        await widget.api.request('POST', '/auth/registro', body: {
          'email': email.text.trim(),
          'senha': password.text,
          if (registeringClient) ...{
            'nivelAcesso': 'CLIENTE',
            'nome': name.text.trim(),
            'telefone': phone.text.replaceAll(RegExp(r'\D'), ''),
          },
        });
        _message('Conta criada. Agora faça o login.');
        setState(() {
          registering = false;
          password.clear();
        });
      } else {
        final data = await widget.api.request('POST', '/auth/login',
            body: {'email': email.text.trim(), 'senha': password.text});
        final token =
            data['accessToken'] ?? data['access_token'] ?? data['token'];
        if (token is! String || token.isEmpty)
          throw Exception('A API não retornou um token de acesso.');
        await widget.api.saveToken(token);
        if (mounted) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (_) => widget.api.isClient
                  ? ClientHomeShell(api: widget.api)
                  : HomeShell(api: widget.api),
            ),
          );
        }
      }
    } catch (error) {
      _message(error.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  void _message(String text) =>
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(text)));

  @override
  Widget build(BuildContext context) => Scaffold(
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 480),
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const CircleAvatar(
                            radius: 28,
                            child: Text('GS',
                                style: TextStyle(fontWeight: FontWeight.bold))),
                        const SizedBox(height: 20),
                        Text('Gestão de Salão',
                            style: Theme.of(context).textTheme.labelLarge),
                        Text(registering ? 'Criar conta' : 'Acesso ao sistema',
                            style: Theme.of(context).textTheme.headlineMedium),
                        const SizedBox(height: 8),
                        Text(registering
                            ? 'Cadastre-se para acessar o painel do salão.'
                            : 'Insira suas credenciais para continuar.'),
                        const SizedBox(height: 24),
                        if (registering) ...[
                          SegmentedButton<bool>(
                            segments: const [
                              ButtonSegment(
                                  value: true, label: Text('Cliente')),
                              ButtonSegment(
                                  value: false, label: Text('Equipe')),
                            ],
                            selected: {registeringClient},
                            onSelectionChanged: (value) =>
                                setState(() => registeringClient = value.first),
                          ),
                          const SizedBox(height: 12),
                          if (registeringClient) ...[
                            TextField(
                                controller: name,
                                decoration: const InputDecoration(
                                    labelText: 'Nome completo')),
                            const SizedBox(height: 12),
                            TextField(
                                controller: phone,
                                keyboardType: TextInputType.phone,
                                decoration: const InputDecoration(
                                    labelText: 'Telefone')),
                            const SizedBox(height: 12),
                          ],
                        ],
                        TextField(
                            controller: email,
                            keyboardType: TextInputType.emailAddress,
                            decoration:
                                const InputDecoration(labelText: 'E-mail')),
                        const SizedBox(height: 12),
                        TextField(
                            controller: password,
                            obscureText: true,
                            decoration:
                                const InputDecoration(labelText: 'Senha')),
                        const SizedBox(height: 20),
                        FilledButton(
                            onPressed: busy ? null : submit,
                            child: busy
                                ? const CircularProgressIndicator()
                                : Text(registering
                                    ? 'Criar conta'
                                    : 'Entrar no painel')),
                        TextButton(
                            onPressed: busy
                                ? null
                                : () =>
                                    setState(() => registering = !registering),
                            child: Text(registering
                                ? 'Já possui conta? Faça login'
                                : 'Ainda não tem acesso? Criar conta')),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      );
}
