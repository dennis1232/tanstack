import Papa from 'papaparse'

export const loadCSVData = async <T>(filePath: string): Promise<T[]> => {
  const response = await fetch(filePath)
  const csvData = await response.text()
  return new Promise<T[]>((resolve, reject) => {
    Papa.parse<T>(csvData, {
      header: true,
      complete: (results: any) => resolve(results.data),
      error: (error: any) => reject(error),
    })
  })
}
