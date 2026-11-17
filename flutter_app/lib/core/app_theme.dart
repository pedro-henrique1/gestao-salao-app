import 'package:flutter/material.dart';

final appTheme = ThemeData(
  useMaterial3: true,
  scaffoldBackgroundColor: const Color(0xfff2ede4),
  colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xffa85d3e)),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: Colors.white,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide.none,
    ),
  ),
);
