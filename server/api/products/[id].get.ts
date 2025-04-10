export default defineEventHandler((event) => {
    const id = parseInt(event.context.params?.id as string)
    
    const product = getProductById(id)
    
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }
    
    return product
  })