
import {hex} from 'chalk'
import state from '../getNavigation.state'

export const startMessage = () => {

  console.log(hex('#65ffc6')`
    ==============================\n
    \n
    \tStarting\n
    \n
    ==============================
  `)
  console.log(hex('#89e9ff')`
    The Pupeteer script will now attempt to scrape navigation data from the store: ${state.storeName}
  `)
}