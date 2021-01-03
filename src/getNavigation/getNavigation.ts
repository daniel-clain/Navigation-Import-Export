import {
  takeInputFromUser, startMessage, gainAccessToNavigation,
  scrapeNavigationData, finishedMessage
} from './get-navigation-implementation'
console.log(process.pid)

export default (async () => {
  startMessage()
  await takeInputFromUser()
  await gainAccessToNavigation()
  await scrapeNavigationData()
  finishedMessage()
})()

