// Usage: import { dialogController } from './dialog'
export const dialogController = {
  dialogId: null as string | null,
  dialog: null as HTMLDialogElement | null,
  closeBt: null as HTMLElement | null,

  init({ dialogId, closeBtId }: { dialogId: string; closeBtId: string }) {
    this.dialogId = dialogId
    this.dialog = document.getElementById(dialogId) as HTMLDialogElement
    this.closeBt = document.getElementById(closeBtId) as HTMLElement

    if (this.dialog) {
      // this.dialog.showModal()
      this.dialog.addEventListener('click', event => {
        if (event.target === this.dialog) {
          this.close()
        }
      })
      this.dialog.addEventListener('cancel', () => this.close())
    }

    if (this.closeBt) {
      this.closeBt.addEventListener('click', () => this.close())
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.dialog && this.dialog.open) {
        this.close()
      }
    })
  },
  open() {
    if (this.dialog) {
      this.dialog.showModal()
    }
  },
  close() {
    if (this.dialog) {
      this.dialog.close()
    }
  }
}
