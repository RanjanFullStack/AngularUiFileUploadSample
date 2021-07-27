module.exports = function (base) {
  return {
    ...base,
    optimization: {
      ...base.optimization,
      splitChunks: {
        ...base.optimization.splitChunks,
        cacheGroups: {
          ...base.optimization.splitChunks.cacheGroups,
          myCustomChunk: {
            enforce: true,
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    }
  }
}