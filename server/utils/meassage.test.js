const { generateMessage } = require('./message');
const expect = require('expect');

describe('Test genrate message', () => {
  it('Should return a correct message', () => {
    var message = generateMessage('Admin', 'Hello');
    expect(message.from).toBe('Admin');
    expect(message.text).toBe('Hello');
  });
});
