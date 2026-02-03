import Handlebars from 'handlebars'

// Register custom Handlebars helpers
export function registerHelpers() {
  // Equality comparison
  Handlebars.registerHelper('eq', function(a, b) {
    return a === b
  })

  // Not equal
  Handlebars.registerHelper('ne', function(a, b) {
    return a !== b
  })

  // Greater than
  Handlebars.registerHelper('gt', function(a, b) {
    return a > b
  })

  // Less than
  Handlebars.registerHelper('lt', function(a, b) {
    return a < b
  })

  // Greater than or equal
  Handlebars.registerHelper('gte', function(a, b) {
    return a >= b
  })

  // Less than or equal
  Handlebars.registerHelper('lte', function(a, b) {
    return a <= b
  })

  // Math operations
  Handlebars.registerHelper('math', function(a, operator, b) {
    switch(operator) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '*':
        return a * b
      case '/':
        return a / b
      case '%':
        return a % b
      default:
        return 0
    }
  })

  // Array includes
  Handlebars.registerHelper('includes', function(array, value) {
    return Array.isArray(array) && array.includes(value)
  })

  // Safe string
  Handlebars.registerHelper('safe', function(html) {
    return new Handlebars.SafeString(html)
  })
}
