import state from "../../state"

export const saveMenu = async () => {
  const saveBtnSelector = '.ui-page-actions__button-group .btn-primary'
  const saveBtn = await state.page.waitForSelector(saveBtnSelector)
  await saveBtn.click()
}