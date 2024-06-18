// Import the 'shared_preferences' package to manage and store user preferences.
import 'package:shared_preferences/shared_preferences.dart';

// Create a class named 'FavoritesManager' to handle favorite items using SharedPreferences.
class FavoritesManager {
  // Declare a private static variable '_prefs' to hold a reference to SharedPreferences.
  static SharedPreferences? _prefs;

  // Create a static method 'init' to initialize SharedPreferences.
  static Future<void> init() async {
    // Initialize '_prefs' by obtaining an instance of SharedPreferences.
    _prefs = await SharedPreferences.getInstance();
  }

  // Create a static method 'saveFavorite' to save a favorite item with a key-value pair.
  static Future<void> saveFavorite(String key, String value) async {
    // Use SharedPreferences to set a string value with the provided key.
    await _prefs?.setString(key, value);
  }

  // Create a static method 'getFavorite' to retrieve a favorite item using its key.
  static String? getFavorite(String key) {
    // Use SharedPreferences to get a string value associated with the provided key.
    return _prefs?.getString(key);
  }

  // Create a static method 'removeFavorite' to remove a favorite item by its key.
  static Future<void> removeFavorite(String key) async {
    // Use SharedPreferences to remove a value associated with the provided key.
    await _prefs?.remove(key);
  }

  // Create a static method 'getAllKeys' to retrieve all keys (for listing all favorites).
  static Set<String> getAllKeys() {
    // Use SharedPreferences to get all stored keys, or an empty set if SharedPreferences is not initialized.
    return _prefs?.getKeys() ?? {};
  }
}
