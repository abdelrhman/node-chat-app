const {isRealString} = require('./validation')

const expect = require('expect');

describe('isRealString' , () => {
  it('Should reject non string values', () => {
    expect(isRealString(1234)).toBe(false);
  });

  it('Should reject strings with only spaces', () => {
    expect(isRealString('   ')).toBe(false);
  });


  it('Should pass', () => {
    expect(isRealString(' fsdfd  ')).toBe(true);
  });



})
