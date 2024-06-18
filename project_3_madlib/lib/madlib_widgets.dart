import 'package:flutter/material.dart'; // Importing Flutter material package
import 'color_widgets.dart'; // Importing custom color widgets
import 'openai_service.dart'; // Importing OpenAI service for generating MadLibs
import 'favorites_manager.dart'; // Importing the manager for handling favorites

// MadLibScreen is the main screen for the MadLib app
class MadLibScreen extends StatefulWidget {
  @override
  // Creating state for MadLibScreen
  _MadLibScreenState createState() => _MadLibScreenState();
}

// State class for MadLibScreen
class _MadLibScreenState extends State<MadLibScreen> {
  // Initializing lists for adjectives, nouns, and verbs
  List<String> adjectives = List.filled(3, '');
  List<String> nouns = List.filled(3, '');
  List<String> verbs = List.filled(3, '');

  // Initializing focus nodes for text fields
  List<FocusNode> focusNodes = [];

  // Variable to keep track of the selected color scheme
  ColorSchemeType selectedColorScheme = ColorSchemeType.Dark;

  @override
  void initState() {
    super.initState();
    // Generating focus nodes for each text field
    focusNodes = List.generate(9, (_) => FocusNode());
  }

  @override
  void dispose() {
    // Disposing each focus node when the screen is disposed
    focusNodes.forEach((node) => node.dispose());
    super.dispose();
  }

  // Function to reset all text fields
  void _refresh() {
    setState(() {
      adjectives = List.filled(3, '');
      nouns = List.filled(3, '');
      verbs = List.filled(3, '');
    });
  }

  // Function to navigate to the display screen for a selected favorite MadLib
  void _showFavoriteMadLib(BuildContext context, String key) {
    // Retrieving the selected MadLib content
    String? madLibContent = FavoritesManager.getFavorite(key);
    if (madLibContent != null) {
      // Navigating to the display screen with the MadLib content
      Navigator.of(context).push(MaterialPageRoute(
          builder: (context) => MadLibDisplayScreen(
              madLibContent: madLibContent, madLibKey: key)));
    }
  }

  // Async function to save a generated MadLib
  Future<void> _saveMadLib(String madLibContent) async {
    // Extracting the character's name from the MadLib
    String characterName = madLibContent.split(RegExp(r'[, ]')).first;

    // Generating a key using the character's name
    String key = 'MadLib_$characterName';

    // Saving the MadLib as a favorite
    await FavoritesManager.saveFavorite(key, madLibContent);

    // Showing a confirmation message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("MadLib saved!")),
    );
  }

  // Function to build dropdown menu items for saved favorites
  List<DropdownMenuItem<String>> _getFavoritesDropdownItems() {
    // Retrieving all saved favorite keys
    var keys = FavoritesManager.getAllKeys();

    return keys.map<DropdownMenuItem<String>>((String key) {
      // Retrieving the full content of the favorite
      String? fullContent = FavoritesManager.getFavorite(key);

      // Truncating the content for display if necessary
      String displayContent = (fullContent != null && fullContent.length > 30)
          ? '${fullContent.substring(0, 30)}...'
          : fullContent ?? '';

      // Creating a dropdown menu item for each favorite
      return DropdownMenuItem<String>(
        value: key,
        child: Container(
          height: 60, // Setting the height of the container
          alignment: Alignment.centerLeft, // Aligning text to the left
          child: Text(
            displayContent,
            overflow: TextOverflow.ellipsis, // Handling text overflow
            style: TextStyle(fontSize: 14), // Setting text style
          ),
        ),
      );
    }).toList();
  }

  // Function to build input fields for adjectives, nouns, and verbs
  Widget _buildInputField(
      int index, String label, List<String> list, FocusNode focusNode) {
    return Column(
      children: [
        // Creating a custom MadLib input field
        MadLibInputField(
            label: label,
            list: list,
            index: index,
            selectedColorScheme: selectedColorScheme,
            focusNode: focusNode,
            nextFocusNode:
                index < focusNodes.length - 1 ? focusNodes[index + 1] : null),
        const SizedBox(height: 8), // Adding spacing after each input field
      ],
    );
  }

  // Method to build the AppBar widget for the MadLib screen
  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      // Setting the title of the AppBar
      title: Text('MadLibs', style: TextStyle(color: _getTextColor())),
      actions: [
        // Dropdown button for favorite MadLibs
        DropdownButton<String>(
          // Setting the icon for the dropdown button
          icon: Icon(Icons.favorite, color: Colors.red),
          // Removing the underline of the dropdown button for aesthetics
          underline: Container(),
          // Populating the dropdown items with favorites
          items: _getFavoritesDropdownItems(),
          // Defining what happens when an item is selected
          onChanged: (String? newValue) {
            if (newValue != null) {
              // Showing the selected favorite MadLib
              _showFavoriteMadLib(context, newValue);
            }
          },
        ),
        // IconButton for refreshing the inputs
        IconButton(
          // Icon for the refresh button
          icon: const Icon(Icons.refresh),
          // Calling the refresh method when pressed
          onPressed: _refresh,
          // Tooltip for the refresh button
          tooltip: 'Refresh',
        ),
      ],
    );
  }

// Widget to build a dropdown for favorite MadLibs
  Widget _buildFavoritesDropdown() {
    // Retrieving all the keys of saved favorites
    var keys = FavoritesManager.getAllKeys();

    return DropdownButton<String>(
      // Setting the icon for the dropdown
      icon: Icon(Icons.favorite, color: Colors.red),
      // Creating dropdown items
      items: keys.map<DropdownMenuItem<String>>((String key) {
        // Creating a dropdown item for each key
        return DropdownMenuItem<String>(
          value: key,
          child: Container(
            // Setting width to half of the screen width
            width: MediaQuery.of(context).size.width * 0.5,
            // Displaying the key with ellipsis for overflow
            child: Text(key, overflow: TextOverflow.ellipsis),
          ),
        );
      }).toList(),
      // Defining what happens when an item is selected
      onChanged: (String? newValue) {
        if (newValue != null) {
          // Handling the selection of a favorite
          var favoriteContent = FavoritesManager.getFavorite(newValue);
          if (favoriteContent != null) {
            _showGeneratedMadLibDialog(context, favoriteContent);
          }
        }
      },
      // Removing the underline for aesthetics
      underline: Container(),
    );
  }

// Widget to build a dropdown menu for theme selection
  Widget _buildThemeFavoritesDropdown() {
    // Retrieving all the keys of saved favorites
    var keys = FavoritesManager.getAllKeys();

    return DropdownButton<String>(
      // Setting the icon for the dropdown
      icon: Icon(Icons.favorite, color: Colors.red),
      // Creating dropdown items for each favorite
      items: keys.map<DropdownMenuItem<String>>((String key) {
        // Getting the full content of the favorite
        String? fullContent = FavoritesManager.getFavorite(key);

        // Truncating the content for display
        String displayContent = (fullContent != null && fullContent.length > 30)
            ? '${fullContent.substring(0, 30)}...'
            : fullContent ?? '';

        // Creating a dropdown item for each favorite
        return DropdownMenuItem<String>(
          value: key,
          child: Text(displayContent, overflow: TextOverflow.ellipsis),
        );
      }).toList(),
      // Defining what happens when an item is selected
      onChanged: (String? newValue) {
        if (newValue != null) {
          // Handling the selection of a favorite
          var favoriteContent = FavoritesManager.getFavorite(newValue);
          if (favoriteContent != null) {
            _showGeneratedMadLibDialog(context, favoriteContent);
          }
        }
      },
      // Building the selected item's UI
      selectedItemBuilder: (BuildContext context) {
        return keys.map<Widget>((String key) {
          // Getting the full content of the favorite
          String? fullContent = FavoritesManager.getFavorite(key);

          // Truncating the content for display
          String displayContent =
              (fullContent != null && fullContent.length > 30)
                  ? '${fullContent.substring(0, 30)}...'
                  : fullContent ?? '';

          // Creating a container to display the selected item
          return Container(
            width:
                MediaQuery.of(context).size.width, // Full width of the screen
            alignment: Alignment.centerLeft,
            child: Text(
              displayContent,
              overflow: TextOverflow.ellipsis,
            ),
          );
        }).toList();
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    // Building the main widget structure for the screen
    return Scaffold(
      // Building the app bar with a custom method
      appBar: _buildAppBar(),
      // Using a scroll view to accommodate overflow of content
      body: SingleChildScrollView(
        // Padding around the column for spacing
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          // Column widget to arrange children vertically
          child: Column(
            // Stretching children across the horizontal axis
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Generating input fields for adjectives
              ...List.generate(
                  3,
                  (index) => _buildInputField(index, "Adjective ${index + 1}",
                      adjectives, focusNodes[index])),
              // Generating input fields for nouns
              ...List.generate(
                  3,
                  (index) => _buildInputField(index, "Noun ${index + 3}", nouns,
                      focusNodes[index + 3])),
              // Generating input fields for verbs
              ...List.generate(
                  3,
                  (index) => _buildInputField(index, "Verb ${index + 6}", verbs,
                      focusNodes[index + 6])),
              // Adding a spacing between elements
              const SizedBox(height: 8),
              // Creating a row for theme dropdown and button
              Row(
                children: [
                  // Expanding the dropdown to occupy available space
                  Expanded(
                      child: ButtonTheme(
                    // Ensuring dropdown is aligned with the button
                    alignedDropdown: true,
                    child:
                        _buildColorSchemeDropdownButton(), // Building dropdown
                  )),
                  // Adding horizontal spacing between dropdown and button
                  const SizedBox(width: 4),
                  // Expanding the button to occupy available space
                  Expanded(
                      child: ElevatedButton(
                    // Defining an action when the button is pressed
                    onPressed: () => _showMadLib(context),
                    // Styling the button
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _getButtonColor(), // Background color
                    ),
                    // Row to hold icon and text in the button
                    child: Row(
                      children: [
                        const Icon(Icons.book), // Icon for the button
                        const SizedBox(width: 8), // Spacing
                        // Text in the button
                        Text('Generate MadLib',
                            style: TextStyle(color: _getButtonTextColor())),
                      ],
                    ),
                  )),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

// Method to build the theme selection dropdown
  Widget _buildColorSchemeDropdownButton() {
    return DropdownButton<ColorSchemeType>(
      value: selectedColorScheme, // Current selected value
      onChanged: (value) {
        setState(() {
          selectedColorScheme = value!; // Updating the selected theme
        });
      },
      items: [
        DropdownMenuItem(
          value: ColorSchemeType.Dark,
          child: Text('Dark Mode'), // Option for dark mode
        ),
        DropdownMenuItem(
          value: ColorSchemeType.AlternativeModeI,
          child: Text('Alternative Mode I'), // Option for alternative mode I
        ),
        DropdownMenuItem(
          value: ColorSchemeType.AlternativeModeII,
          child: Text('Alternative Mode II'), // Option for alternative mode II
        ),
      ],
      underline: Container(), // Removing the underline of the dropdown
    );
  }

// Method to determine the button's background color based on the selected color scheme
  Color _getButtonColor() {
    switch (selectedColorScheme) {
      case ColorSchemeType.Dark:
        return const Color(
            0xFFFAF0E6); // Returns a specific color for Dark mode
      case ColorSchemeType.AlternativeModeI:
        return const Color(
            0xFFCAEDFF); // Returns a specific color for Alternative Mode I
      case ColorSchemeType.AlternativeModeII:
        return const Color(
            0xFF265073); // Returns a specific color for Alternative Mode II
    }
  }

// Method to determine the button's text color based on the selected color scheme
  Color _getButtonTextColor() {
    switch (selectedColorScheme) {
      case ColorSchemeType.Dark:
        return Colors.black; // Returns black color for text in Dark mode
      case ColorSchemeType.AlternativeModeI:
        return Colors
            .black; // Returns black color for text in Alternative Mode I
      case ColorSchemeType.AlternativeModeII:
        return Colors
            .white; // Returns white color for text in Alternative Mode II
    }
  }

// Method to show a dialog containing the generated MadLib
  void _showGeneratedMadLibDialog(BuildContext context, String madLibContent) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Generated MadLib"),
          content: SingleChildScrollView(child: Text(madLibContent)),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text("Close"),
            ),
            TextButton(
              onPressed: () {
                _saveMadLib(madLibContent);
                Navigator.of(context).pop();
              },
              child: const Text("Save to Favorites"),
            ),
          ],
        );
      },
    );
  }

// Async method to generate and show the MadLib
  Future<void> _showMadLib(BuildContext context) async {
    // Check if any input fields are empty
    if (adjectives.any((element) => element.isEmpty) ||
        nouns.any((element) => element.isEmpty) ||
        verbs.any((element) => element.isEmpty)) {
      _showDialog(context, 'Input Required',
          'Please fill in all fields to generate a MadLib.');
      return;
    }

    // Show a loading dialog
    _showDialog(context, 'Generated MadLib', 'Generating...',
        isProgressIndicator: true);

    // Instantiate the OpenAI service
    final openaiService = OpenAIService();

    try {
      // Try to generate the MadLib
      final generatedMadLib =
          await openaiService.generateMadLib(adjectives, nouns, verbs);
      // Close the progress dialog
      Navigator.of(context).pop();
      // Navigate to the MadLib display screen
      Navigator.of(context).push(MaterialPageRoute(
          builder: (context) => MadLibDisplayScreen(
              madLibContent: generatedMadLib, madLibKey: '')));
    } catch (e) {
      // Close the progress dialog and show an error dialog
      Navigator.of(context).pop();
      _showDialog(context, 'Error',
          'Failed to generate MadLib. Error: ${e.toString()}');
    }
  }

// Method to show a generic dialog
  void _showDialog(BuildContext context, String title, String content,
      {bool isProgressIndicator = false}) {
    showDialog(
      context: context,
      barrierDismissible: !isProgressIndicator,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: isProgressIndicator
              ? CircularProgressIndicator()
              : SingleChildScrollView(child: Text(content)),
          actions: isProgressIndicator
              ? []
              : [
                  TextButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                    child: const Text("Close"),
                  ),
                ],
        );
      },
    );
  }

// Method to get the title color based on the selected color scheme
  Color _getTitleColor() {
    switch (selectedColorScheme) {
      case ColorSchemeType.Dark:
        return Colors.white; // Returns white color for title in Dark mode
      case ColorSchemeType.AlternativeModeI:
        return Colors
            .black; // Returns black color for title in Alternative Mode I
      case ColorSchemeType.AlternativeModeII:
        return Colors
            .white; // Returns white color for title in Alternative Mode II
    }
  }

// Method to get the dialog background color based on the selected color scheme
  Color _getDialogBackgroundColor() {
    switch (selectedColorScheme) {
      case ColorSchemeType.Dark:
        return const Color(
            0xFF352F44); // Returns a specific color for dialog background in Dark mode
      case ColorSchemeType.AlternativeModeI:
        return const Color(
            0xFFCAEDFF); // Returns a specific color for dialog background in Alternative Mode I
      case ColorSchemeType.AlternativeModeII:
        return const Color(
            0xFF265073); // Returns a specific color for dialog background in Alternative Mode II
    }
  }

// Method to get the text color based on the selected color scheme
  Color _getTextColor() {
    switch (selectedColorScheme) {
      case ColorSchemeType.Dark:
        return Colors.white; // Returns white color for text in Dark mode
      case ColorSchemeType.AlternativeModeI:
        return Colors
            .black; // Returns black color for text in Alternative Mode I
      case ColorSchemeType.AlternativeModeII:
        return Colors
            .white; // Returns white color for text in Alternative Mode II
    }
  }
}

// A stateless widget that creates an input field for the MadLibs
class MadLibInputField extends StatelessWidget {
  // Declaration of variables required for the widget
  final String label; // Label for the input field
  final List<String> list; // List to store the input data
  final int index; // Index to identify which element of the list to modify
  final ColorSchemeType selectedColorScheme; // Current color scheme
  final FocusNode focusNode; // Focus node for this input field
  final FocusNode? nextFocusNode; // Focus node for the next input field

  // Constructor to initialize the widget with required data
  MadLibInputField(
      {required this.label,
      required this.list,
      required this.index,
      required this.selectedColorScheme,
      required this.focusNode,
      this.nextFocusNode});

  // Overridden build method to construct the widget
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Icon(
          Icons.edit,
          color: Colors.white, // Icon color
        ),
        const SizedBox(
            width: 8), // Provides spacing between icon and text field
        Expanded(
          child: TextField(
            focusNode: focusNode, // Assigns the focus node
            textInputAction: nextFocusNode != null
                ? TextInputAction
                    .next // Moves focus to next node when user presses "next"
                : TextInputAction
                    .done, // Hides keyboard when user presses "done"
            onSubmitted: (_) {
              if (nextFocusNode != null) {
                FocusScope.of(context)
                    .requestFocus(nextFocusNode); // Changes focus to next node
              }
            },
            onChanged: (value) {
              list[index] =
                  value; // Updates the corresponding value in the list
            },
            decoration: InputDecoration(
              labelText: label, // Sets the label for the input field
              labelStyle: TextStyle(
                  color: _getLabelColor()), // Sets the style for the label
              enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(
                    color:
                        _getBorderColor()), // Sets the border color when field is enabled
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(
                    color:
                        _getBorderColor()), // Sets the border color when field is focused
              ),
              fillColor:
                  _getInputFieldBackgroundColor(), // Sets the background color of the field
              filled: true,
            ),
            style: TextStyle(
                color:
                    _getTextColor()), // Sets the text color in the input field
          ),
        )
      ],
    );
  }

  // Method to get label color based on selected color scheme
  Color _getLabelColor() {
    switch (selectedColorScheme) {
      case ColorSchemeType.Dark:
        return Colors.white; // White label color for dark mode
      case ColorSchemeType.AlternativeModeI:
        return Colors.black; // Black label color for Alternative Mode I
      case ColorSchemeType.AlternativeModeII:
        return Colors.black; // Black label color for Alternative Mode II
    }
  }

  // Method to get border color based on selected color scheme
  Color _getBorderColor() {
    return _getColorFromColorScheme(
        const Color(0xFFFAF0E6)); // Dark mode border color
  }

  // Method to get input field background color based on selected color scheme
  Color _getInputFieldBackgroundColor() {
    return _getColorFromColorScheme(
        const Color(0xFF352F44)); // Dark mode background color
  }

  // Method to get text color based on selected color scheme
  Color _getTextColor() {
    switch (selectedColorScheme) {
      case ColorSchemeType.Dark:
        return Colors.white; // White text color for dark mode
      case ColorSchemeType.AlternativeModeI:
        return Colors.black; // Black text color for Alternative Mode I
      case ColorSchemeType.AlternativeModeII:
        return Colors.black; // White text color for Alternative Mode II
    }
  }

  // Helper method to get color based on the color scheme
  Color _getColorFromColorScheme(Color defaultColor) {
    switch (selectedColorScheme) {
      case ColorSchemeType.Dark:
        return defaultColor; // Returns default color for Dark mode
      case ColorSchemeType.AlternativeModeI:
        return const Color(0xFFFBF0B2); // Yellow color for Alternative Mode I
      case ColorSchemeType.AlternativeModeII:
        return const Color(0xFFECF4D6); // Green color for Alternative Mode II
      default:
        return defaultColor; // Returns default color if none of the cases match
    }
  }
}

// A stateless widget to display the generated MadLib
class MadLibDisplayScreen extends StatelessWidget {
  // Declaration of variables required for the widget
  final String madLibContent; // The content of the MadLib
  final String? madLibKey; // Key to identify if the MadLib is a favorite

  // Constructor to initialize the widget with required data
  MadLibDisplayScreen({required this.madLibContent, this.madLibKey});

  // Overridden build method to construct the widget
  @override
  Widget build(BuildContext context) {
    // Determine if the MadLib is already a favorite
    bool isFavorite =
        madLibKey != null && FavoritesManager.getFavorite(madLibKey!) != null;

    return Scaffold(
      appBar: AppBar(
        title: Text('Generated MadLib'), // Sets the title for the app bar
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16.0), // Sets padding around the content
        child: Text(madLibContent,
            style: TextStyle(
                color: Colors
                    .white)), // Displays the content with white text color
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation
          .centerFloat, // Positions the floating action buttons
      floatingActionButton: Row(
        mainAxisAlignment:
            MainAxisAlignment.spaceEvenly, // Aligns buttons evenly in the row
        children: [
          FloatingActionButton.extended(
            onPressed: () =>
                Navigator.of(context).pop(), // Goes back to the previous screen
            icon: Icon(Icons.arrow_back), // Back arrow icon
            label: Text('Back'), // Label for the button
            backgroundColor:
                Colors.blue, // Sets the background color for the button
          ),
          FloatingActionButton.extended(
            backgroundColor: isFavorite
                ? Colors.red
                : Colors.grey, // Changes color based on favorite status
            icon: Icon(Icons.favorite), // Favorite icon
            label: Text(isFavorite
                ? 'Favorited'
                : 'Save to Favorites'), // Label changes based on favorite status
            onPressed: () {
              if (!isFavorite) {
                // Extracts the character's name from the MadLib content
                String characterName =
                    madLibContent.split(RegExp(r'[, ]')).first;
                String key =
                    'MadLib_$characterName'; // Creates a key for saving
                FavoritesManager.saveFavorite(
                    key, madLibContent); // Saves the MadLib to favorites
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                      content: Text(
                          "MadLib saved to favorites!")), // Shows confirmation message
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                      content: Text(
                          "MadLib is already a favorite")), // Shows already favorited message
                );
              }
            },
          ),
        ],
      ),
    );
  }
}
