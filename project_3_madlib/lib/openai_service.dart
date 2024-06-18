import 'dart:convert';
import 'package:http/http.dart' as http;
import 'fantasy_names.dart';

class OpenAIService {
  String apiKey = '';

  Future<String> generateMadLib(
      List<String> adjectives, List<String> nouns, List<String> verbs) async {
    try {
      final url = Uri.parse(
          'https://api.openai.com/v1/engines/text-davinci-003/completions');
      final headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $apiKey',
      };
      String characterName = getRandomFantasyName();

      String userPrompt =
          "Create an adventurous story set in a dark, ancient dungeon. "
          "The main character, a daring explorer named $characterName, navigates the treacherous paths filled with ${nouns.join(", ")}. "
          "Utilize the adjectives: ${adjectives.join(", ")} and verbs: ${verbs.join(", ")} to describe their encounters with mystical creatures, "
          "hidden traps, and ancient relics. How does $characterName use their wit and bravery to overcome the challenges and unravel the dungeon's mysteries?"
          "No unfinished sentences.";
      final requestBody = jsonEncode({
        'prompt': userPrompt,
        'max_tokens': 250,
        'temperature': 0.8 // Adjust as needed for MadLib length
      });

      final response =
          await http.post(url, headers: headers, body: requestBody);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        String generatedText = data['choices'][0]['text'];
        return generatedText;
      } else {
        return 'Error: ${response.reasonPhrase}';
      }
    } catch (e) {
      return 'Error: ${e.toString()}';
    }
  }
}
