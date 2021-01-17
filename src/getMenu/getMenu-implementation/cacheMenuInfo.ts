
import state from '../../state'
import {promises as fsPromises} from 'fs'

export default async () => {
  console.log('* caching menu info')

  const fileToWriteTo = "menuData.cache.json"
  const dataToWrite = JSON.stringify(state.navData)

  try{
    await fsPromises.writeFile(fileToWriteTo, dataToWrite)
  } 
  catch (err) {
    console.log('Failed to save menu data', err)
  }

}

 