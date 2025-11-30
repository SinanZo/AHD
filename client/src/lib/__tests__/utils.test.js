import { describe, it, expect } from 'vitest'
import { slugify } from '../utils'

describe('slugify', () => {
  it('converts ascii text to kebab-case', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes punctuation and preserves arabic chars', () => {
    expect(slugify('خدمات تركيب ستائر')).toBe('خدمات-تركيب-ستائر')
  })

  it('handles empty and non-string inputs gracefully', () => {
    expect(slugify()).toBe('')
    expect(slugify(null)).toBe('null')
  })
})
