import { hex } from 'chalk'
import getMenu from './getMenu/getMenu'
import setMenu from './setMenu/setMenu'

export default (async () => {
  console.log(hex('#65ffc6')`
    ==============================\n
    \tStarting\n
    ==============================
  `)
  await getMenu()
  await setMenu()

  console.log(hex('#cb65ff')`
    ==============================\n
    \tComplete\n
    ==============================
  `)
})()