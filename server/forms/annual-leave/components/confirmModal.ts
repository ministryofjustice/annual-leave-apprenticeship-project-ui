import { block as blockBuilder } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  buildComponent,
  type BasicBlockProps,
  type BlockDefinition,
  type ResolvableString,
} from '@ministryofjustice/hmpps-forge/core/components'

import { escapeHtml } from '../helpers'

export interface confirmModalParams {
  modalId: string
  openModalButtonText: string
  openModalButtonStyle?: string
  heading: string
  description: string
  confirmHref: string
  confirmLabel?: string
  confirmStyle?: string
  cancelLabel?: string
}

export interface confirmModalProps extends BasicBlockProps {
  modalId: ResolvableString
  openModalButtonText: ResolvableString
  openModalButtonStyle?: ResolvableString
  heading: ResolvableString
  description: ResolvableString
  confirmHref: ResolvableString
  confirmLabel?: ResolvableString
  confirmStyle?: ResolvableString
  cancelLabel?: ResolvableString
}

export interface ConfirmModal extends BlockDefinition, confirmModalProps {
  variant: 'confirmModal'
}

export const renderConfirmModalHtml = (params: confirmModalParams): string => {
  const modalId = escapeHtml(params.modalId)
  const openModalButtonText = escapeHtml(params.openModalButtonText)
  const openModalButtonStyle = escapeHtml(params.openModalButtonStyle ?? '')
  const heading = escapeHtml(params.heading)
  const description = escapeHtml(params.description)
  const confirmHref = escapeHtml(params.confirmHref)
  const confirmLabel = escapeHtml(params.confirmLabel ?? `Yes, I'm sure`)
  const confirmStyle = escapeHtml(params.confirmStyle ?? '')
  const cancelLabel = escapeHtml(params.cancelLabel ?? 'No, cancel')

  return `
    <div class="govuk-!-text-align-right govuk-!-margin-top-3">
      <button type="button" class="govuk-button ${openModalButtonStyle} govuk-!-margin-bottom-0" data-module="govuk-button" data-modal-open="${modalId}">${openModalButtonText}</button>
    </div>
    <dialog class="app-modal" id="${modalId}" aria-labelledby="${modalId}-title">
      <div class="app-modal__content">
        <h2 class="govuk-heading-l" id="${modalId}-title">${heading}</h2>
        <p class="govuk-body">${description}</p>
        <div class="govuk-button-group">
          <a href="${confirmHref}" role="button" draggable="false" class="govuk-button ${confirmStyle}" data-module="govuk-button">${confirmLabel}</a>
          <button type="button" class="govuk-link app-modal__cancel" data-modal-close="${modalId}">${cancelLabel}</button>
        </div>
      </div>
    </dialog>`
}

export const confirmModal = (props: confirmModalProps): ConfirmModal => {
  return blockBuilder<ConfirmModal>({ ...props, variant: 'confirmModal' })
}

export const confirmModalComponent = buildComponent<ConfirmModal>('confirmModal', block => {
  return renderConfirmModalHtml({
    modalId: block.modalId as string,
    openModalButtonText: block.openModalButtonText as string,
    openModalButtonStyle: block.openModalButtonStyle as string,
    heading: block.heading as string,
    description: block.description as string,
    confirmHref: block.confirmHref as string,
    confirmLabel: block.confirmLabel as string | undefined,
    confirmStyle: block.confirmStyle as string | undefined,
    cancelLabel: block.cancelLabel as string | undefined,
  })
})
