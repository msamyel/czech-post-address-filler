const { isPartOfStreetName } = require('../src/content.js');

test('parse word to be a part of street name / house number', () => {
    // correct parts of street names
    expect(isPartOfStreetName('1st')).toBe(true);
    expect(isPartOfStreetName('Avenue')).toBe(true);
    expect(isPartOfStreetName('3rd')).toBe(true);
    expect(isPartOfStreetName('23rd')).toBe(true);
    expect(isPartOfStreetName('St')).toBe(true);
    expect(isPartOfStreetName('St.')).toBe(true);

    // house/appartment numbers
    expect(isPartOfStreetName('123A')).toBe(false);
    expect(isPartOfStreetName('123')).toBe(false);
    expect(isPartOfStreetName('76/14')).toBe(false);
    expect(isPartOfStreetName('76-14')).toBe(false);
    expect(isPartOfStreetName('76')).toBe(false);
    expect(isPartOfStreetName('14')).toBe(false);
});