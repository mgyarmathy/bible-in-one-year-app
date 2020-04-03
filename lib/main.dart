import 'package:flutter/material.dart';
import 'package:bible_in_one_year/navigation.dart';
import 'package:bible_in_one_year/screens/today.dart';
import 'package:bible_in_one_year/screens/reading_plan.dart';
import 'package:bible_in_one_year/screens/settings.dart';

void main() => runApp(App());

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Bible In One Year',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: AppContainer(title: 'Bible In One Year'),
    );
  }
}

class AppContainer extends StatefulWidget {
  AppContainer({Key key, this.title}) : super(key: key);

  final String title;

  final List<Widget> screens = <Widget>[
    TodayScreen(),
    ReadingPlanScreen(),
    SettingsScreen(),
  ];

  @override
  _AppContainerState createState() => _AppContainerState();
}

class _AppContainerState extends State<AppContainer> {
  int _selectedNavIndex = 0;

  void _onNavItemTapped(int index) {
    setState(() {
      _selectedNavIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: widget.screens.elementAt(_selectedNavIndex),
      ),
      bottomNavigationBar: NavigationBar(selectedIndex: _selectedNavIndex, onTap: _onNavItemTapped),
    );
  }
}
