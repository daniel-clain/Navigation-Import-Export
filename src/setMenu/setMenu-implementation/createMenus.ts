import state from '../../state'

export const createMenu = async (): Promise<boolean> => {
  
  await accessNavigationView()
  console.log('* start creating menus')
  console.log('state', state.navData)

  await createBaseMenu()

  return await false
}


async function accessNavigationView(){

  console.log('--- go to navigation view')
  const fullUrl = state.page.url()
  const endOfBaseUrl = 'myshopify.com/admin'
  const endOfBaseUrlIndex = fullUrl.indexOf(endOfBaseUrl) + endOfBaseUrl.length
  const baseUrl = fullUrl.slice(0, endOfBaseUrlIndex)
  const goToUrl = `${baseUrl}/menus`
  console.log('goToURl', goToUrl)
  await state.page.goto(goToUrl)
  
}


const createBaseMenu = async () => {
  
}

