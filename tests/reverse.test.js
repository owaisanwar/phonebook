const reverse = require('../utils/for_testing').reverse;

test('should reverse of a', () => { 
    const result = reverse('a');
    expect(result).toBe('a');
})

test('reverse of react', () => {
    const result = reverse('React');
    expect(result).toBe('tcaeR');
})

test('reverse of releveler', () => {
    const result = reverse('releveler');
    expect(result).toBe('releveler');
})