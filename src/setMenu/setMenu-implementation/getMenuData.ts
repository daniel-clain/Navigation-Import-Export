
import {promises as fsPromises} from 'fs'
import state from '../../state'

export default async () => {
  console.log('* getting menu data from cache')
  const fileToWriteTo = "cache/menuData.cache.json"
  try{
    const fileData = await fsPromises.readFile(fileToWriteTo)
    state.menuData = JSON.parse(fileData.toString())
  }
  catch (err){
    return console.log('Failed to read menu data', err)
  }
}