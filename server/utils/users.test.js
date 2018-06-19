const expect = require('expect');


const {Users} = require('./users')


describe("Users Class", () => {
  var users;

  beforeEach( () => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'podo',
      room: 'room1'
    },{
      id: '2',
      name: 'jen',
      room: 'room2'
    },{
      id: '3',
      name: 'ali',
      room: 'room1'
    }];
  });

  it('Should add new user', () => {


    var user = {id: 123, name: 'podo', room: 'test' };
    var resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users.length).toBe(4);
    expect(resUser.id).toBe(user.id);
    expect(resUser.name).toBe(user.name);
    expect(resUser.room).toBe(user.room);
  });


  it('Should return names for room 1', () => {
    var names = users.getUsersList('room1');
    expect(names.length).toBe(2);
  });

  it('Should remove a user', () => {

    var user = users.removeUser('2')
    expect(users.users.length).toBe(2);
    expect(user.name).toBe('jen');

  });

  it('Should not  remove a user', () => {
    users.removeUser('44')
    expect(users.users.length).toBe(3);
  });



    it('Should return user', () => {
      var user = users.getUser('1')
      expect(user.name).toBe('podo');
    });


    it('Should not return user', () => {
      var user = users.getUser('11')
      expect(user).toBeFalsy();
    });


})
