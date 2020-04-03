import 'package:flutter/material.dart';
import 'package:flutter_icons/flutter_icons.dart';

class NavigationBar extends StatelessWidget {
  NavigationBar({this.selectedIndex, this.onTap}) : super();

  final int selectedIndex;
  final Function(int) onTap;

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.calendar_today),
          title: Text('Today'),
        ),
        BottomNavigationBarItem(
          icon: Icon(FontAwesome.map_o),
          title: Text('Reading Plan'),
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.settings),
          title: Text('Settings'),
        ),
      ],
      currentIndex: this.selectedIndex,
      selectedItemColor: Colors.blue,
      onTap: this.onTap,
    );
  }
}
