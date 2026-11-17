import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

const apiBaseUrl = String.fromEnvironment(
  'API_URL',
  defaultValue: 'http://10.0.2.2:3000',
);

class ApiClient {
  ApiClient(this._preferences);
  final SharedPreferences _preferences;

  String? get token => _preferences.getString('token');
  String? get accessLevel {
    final value = token;
    if (value == null) return null;
    try {
      final payload = value.split('.')[1];
      final normalized = base64Url.normalize(payload);
      final data = jsonDecode(utf8.decode(base64Url.decode(normalized)));
      return data['nivelAcesso'] as String?;
    } catch (_) {
      return null;
    }
  }

  bool get isClient => accessLevel == 'CLIENTE';

  Future<void> saveToken(String value) =>
      _preferences.setString('token', value);
  Future<void> clearToken() => _preferences.remove('token');

  Future<dynamic> request(
    String method,
    String path, {
    Object? body,
    Map<String, String>? query,
  }) async {
    final uri = Uri.parse('$apiBaseUrl$path').replace(queryParameters: query);
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (token != null) headers['Authorization'] = 'Bearer $token';
    final encoded = body == null ? null : jsonEncode(body);
    final response = switch (method) {
      'GET' => await http.get(uri, headers: headers),
      'POST' => await http.post(uri, headers: headers, body: encoded),
      'PATCH' => await http.patch(uri, headers: headers, body: encoded),
      'DELETE' => await http.delete(uri, headers: headers),
      _ => throw ArgumentError('Método HTTP inválido'),
    };
    final data = response.body.isEmpty ? null : jsonDecode(response.body);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      final message = data is Map ? data['message'] : null;
      throw Exception(
        message is String ? message : 'Não foi possível concluir a operação.',
      );
    }
    return data;
  }
}
