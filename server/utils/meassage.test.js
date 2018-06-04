const { generateMessage, generateLocationMessage } = require('./message');
const expect = require('expect');

describe('Test genrate message', () => {
  it('Should return a correct message', () => {
    var message = generateMessage('Admin', 'Hello');
    expect(message.from).toBe('Admin');
    expect(message.text).toBe('Hello');
  });
});

describe('Test genrate location message', () => {
  it('Should return a correct message with location ', () => {
    var message = generateLocationMessage('Admin', 123, 456);
    expect(message.from).toBe('Admin');
    expect(message.url).toBe('https://www.google.com/maps?q=123,456');
  });
});
