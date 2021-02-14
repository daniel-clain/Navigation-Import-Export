
import state from '../../state'
import {promises as fsPromises} from 'fs'

export default async () => {
  console.log('* caching menu info')

  const fileToWriteTo = "cache/menuData.cache.json"
  const dataToWrite = JSON.stringify(state.menuData)

  try{
    await fsPromises.writeFile(fileToWriteTo, dataToWrite)
  } 
  catch (err) {
    console.log('Failed to save menu data', err)
  }

}

 