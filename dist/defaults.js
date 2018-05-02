'use strict';

module.exports = {
    children: 'children',
    parent: 'parent',
    name: 'name',
    data: 'data',
    expanded: 'expanded',
    move: true,
    indentation: 20,
    nameStyles: {
        padding: '0.5em 1em',
        margin: '0.1em',
        background: 'rgba(230,230,230)',
        userSelect: 'none',
        cursor: ['grab', '-webkit-grab', 'pointer'],
        width: '100px'
    },
    threshold: 10,
    indicatorStyles: {
        background: 'rgb(150,150,255)',
        height: '5px',
        width: '100px',
        padding: '0 1em'
    },
    expandStyles: {
        width: '15px',
        height: '15px',
        cursor: 'pointer'
    },
    holdTime: 1000,
    expandOnClick: true,
    dragOpacity: 0.75
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kZWZhdWx0cy5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwiY2hpbGRyZW4iLCJwYXJlbnQiLCJuYW1lIiwiZGF0YSIsImV4cGFuZGVkIiwibW92ZSIsImluZGVudGF0aW9uIiwibmFtZVN0eWxlcyIsInBhZGRpbmciLCJtYXJnaW4iLCJiYWNrZ3JvdW5kIiwidXNlclNlbGVjdCIsImN1cnNvciIsIndpZHRoIiwidGhyZXNob2xkIiwiaW5kaWNhdG9yU3R5bGVzIiwiaGVpZ2h0IiwiZXhwYW5kU3R5bGVzIiwiaG9sZFRpbWUiLCJleHBhbmRPbkNsaWNrIiwiZHJhZ09wYWNpdHkiXSwibWFwcGluZ3MiOiI7O0FBQUFBLE9BQU9DLE9BQVAsR0FBaUI7QUFDYkMsY0FBVSxVQURHO0FBRWJDLFlBQVEsUUFGSztBQUdiQyxVQUFNLE1BSE87QUFJYkMsVUFBTSxNQUpPO0FBS2JDLGNBQVUsVUFMRztBQU1iQyxVQUFNLElBTk87QUFPYkMsaUJBQWEsRUFQQTtBQVFiQyxnQkFBWTtBQUNSQyxpQkFBUyxXQUREO0FBRVJDLGdCQUFRLE9BRkE7QUFHUkMsb0JBQVksbUJBSEo7QUFJUkMsb0JBQVksTUFKSjtBQUtSQyxnQkFBUSxDQUFDLE1BQUQsRUFBUyxjQUFULEVBQXlCLFNBQXpCLENBTEE7QUFNUkMsZUFBTztBQU5DLEtBUkM7QUFnQmJDLGVBQVcsRUFoQkU7QUFpQmJDLHFCQUFpQjtBQUNiTCxvQkFBWSxrQkFEQztBQUViTSxnQkFBUSxLQUZLO0FBR2JILGVBQU8sT0FITTtBQUliTCxpQkFBUztBQUpJLEtBakJKO0FBdUJiUyxrQkFBYztBQUNWSixlQUFPLE1BREc7QUFFVkcsZ0JBQVEsTUFGRTtBQUdWSixnQkFBUTtBQUhFLEtBdkJEO0FBNEJiTSxjQUFVLElBNUJHO0FBNkJiQyxtQkFBZSxJQTdCRjtBQThCYkMsaUJBQWE7QUE5QkEsQ0FBakIiLCJmaWxlIjoiZGVmYXVsdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGNoaWxkcmVuOiAnY2hpbGRyZW4nLFxyXG4gICAgcGFyZW50OiAncGFyZW50JyxcclxuICAgIG5hbWU6ICduYW1lJyxcclxuICAgIGRhdGE6ICdkYXRhJyxcclxuICAgIGV4cGFuZGVkOiAnZXhwYW5kZWQnLFxyXG4gICAgbW92ZTogdHJ1ZSxcclxuICAgIGluZGVudGF0aW9uOiAyMCxcclxuICAgIG5hbWVTdHlsZXM6IHtcclxuICAgICAgICBwYWRkaW5nOiAnMC41ZW0gMWVtJyxcclxuICAgICAgICBtYXJnaW46ICcwLjFlbScsXHJcbiAgICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMjMwLDIzMCwyMzApJyxcclxuICAgICAgICB1c2VyU2VsZWN0OiAnbm9uZScsXHJcbiAgICAgICAgY3Vyc29yOiBbJ2dyYWInLCAnLXdlYmtpdC1ncmFiJywgJ3BvaW50ZXInXSxcclxuICAgICAgICB3aWR0aDogJzEwMHB4J1xyXG4gICAgfSxcclxuICAgIHRocmVzaG9sZDogMTAsXHJcbiAgICBpbmRpY2F0b3JTdHlsZXM6IHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAncmdiKDE1MCwxNTAsMjU1KScsXHJcbiAgICAgICAgaGVpZ2h0OiAnNXB4JyxcclxuICAgICAgICB3aWR0aDogJzEwMHB4JyxcclxuICAgICAgICBwYWRkaW5nOiAnMCAxZW0nXHJcbiAgICB9LFxyXG4gICAgZXhwYW5kU3R5bGVzOiB7XHJcbiAgICAgICAgd2lkdGg6ICcxNXB4JyxcclxuICAgICAgICBoZWlnaHQ6ICcxNXB4JyxcclxuICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xyXG4gICAgfSxcclxuICAgIGhvbGRUaW1lOiAxMDAwLFxyXG4gICAgZXhwYW5kT25DbGljazogdHJ1ZSxcclxuICAgIGRyYWdPcGFjaXR5OiAwLjc1XHJcbn0iXX0=