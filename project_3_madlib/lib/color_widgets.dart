import 'package:flutter/material.dart';

enum ColorSchemeType { Dark, AlternativeModeI, AlternativeModeII }

ThemeData buildDarkTheme() {
  return ThemeData(
    primarySwatch: Colors.blue,
    scaffoldBackgroundColor: const Color(0xFF352F44), // Dark mode background
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF5C5470), // Dark mode app bar
      titleTextStyle: TextStyle(
        color: Colors.white, // Dark mode app bar title text color
      ),
    ),
  );
}

ThemeData buildLightTheme() {
  return ThemeData(
    primarySwatch: Colors.blue,
    scaffoldBackgroundColor:
        const Color(0xFFF5F5F5), // Light grey background for light mode
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFFFBF0B2), // Light mode app bar
      titleTextStyle: TextStyle(
        color: Colors.white, // Black text color for light mode app bar title
      ),
    ),
  );
}

ThemeData buildAlternateTheme() {
  return ThemeData(
    primarySwatch: Colors.blue,
    scaffoldBackgroundColor:
        const Color(0xFF265073), // Light green background for alternate mode
    appBarTheme: const AppBarTheme(
      backgroundColor:
          Color(0xFF265073), // Dark blue app bar for alternate mode
      titleTextStyle: TextStyle(
        color:
            Colors.white, // White text color for alternate mode app bar title
      ),
    ),
  );
}
