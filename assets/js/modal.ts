function initModals(): void {
  document.addEventListener('click', (event: Event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-modal-open], [data-modal-close]')
    if (!target) return

    const openId = target.dataset.modalOpen
    const closeId = target.dataset.modalClose
    const dialog = document.getElementById((openId ?? closeId)!) as HTMLDialogElement | null

    if (openId) dialog?.showModal()
    if (closeId) dialog?.close()
  })
}

export default initModals
