import {
  takeInputFromUser, startMessage, gainAccessToNavigation,
  scrapeNavigationData, massageScrapedDataIntoJSON, finishedMessage
} from './get-navigation-implementation/'
import * as sourceMapSupport from 'source-map-support'
console.log(sourceMapSupport)
sourceMapSupport.install()

console.log(process.pid)
;(async () => {
  await takeInputFromUser()
  startMessage()
  await gainAccessToNavigation()
  await scrapeNavigationData()
  massageScrapedDataIntoJSON()
  finishedMessage()
})()