const targets = ['Bandeira', 'Forma de Pagamento', 'Valor'] // aqui vai o nome das colunas

const anchor = document.querySelector('a')
const form = document.querySelector('form')

function ConvertToCSV(objArray) {
  let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray
  let str = ''

  for (let i = 0; i < array.length; i++) {
    let line = ''

    for (let index in array[i]) {
      if (line != '') line += ';'
      line += array[i][index]
    }
    str += line + '\r\n'
  }

  return str
}

function pegarDadosFiltrados(reader, targetsInput) {
  const csv = reader.result
  const rows = String(csv).split('\n')
  const rowsFiltered = rows.map(row => row.replace('\r', ''))
  const dadosFiltrados = []

  const targetsIndex = []
  const titles = rowsFiltered[0].split(';')

  const targets = []
  for (const target of targetsInput) {
    targets.push(target.toLowerCase())
  }

  for (const title of titles) {
    if (targets.includes(title.toLowerCase())) {
      targetsIndex.push(titles.indexOf(title))
    }
  }

  for (const row of rowsFiltered) {
    const celulas = row.split(';')

    let rowData = {}

    for (const target of targetsIndex) {
      rowData[titles[target]] = celulas[target]
    }
    dadosFiltrados.push(rowData)
  }

  return dadosFiltrados
}

function gerarNovoCsv(dadosFiltrados, file) {
  const novoCsv = ConvertToCSV(dadosFiltrados)
  const blob = new Blob(['\ufeff', novoCsv])
  const url = URL.createObjectURL(blob)

  anchor.download = file.name.replace('.csv', '-filtrado.csv')
  anchor.href = url

  anchor.click()
}

form.addEventListener('submit', e => {
  e.preventDefault()

  const file = form.elements.arquivo.files[0]
  const reader = new FileReader()
  reader.readAsBinaryString(file)

  reader.addEventListener('load', () => {
    const dadosFiltrados = pegarDadosFiltrados(reader, targets)
    gerarNovoCsv(dadosFiltrados, file)
  })
})
