import 'package:flutter/material.dart';
import 'color_widgets.dart';
import 'madlib_widgets.dart';
import 'favorites_manager.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await FavoritesManager.init();
  runApp(MyMadLibApp());
}

class MyMadLibApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MadLib App',
      theme: buildDarkTheme(),
      home: MadLibScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
