import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PublishableApiKey } from '@medusajs/medusa'
import { useAdminUpdatePublishableApiKey } from 'medusa-react'

import Button from '../../../components/fundamentals/button'
import CrossIcon from '../../../components/fundamentals/icons/cross-icon'
import InputField from '../../../components/molecules/input'
import SideModal from '../../../components/molecules/modal/side-modal'
import useNotification from '../../../hooks/use-notification'

type DetailsModalProps = {
  close: () => void
  selectedKey?: PublishableApiKey
}

/**
 * Publishable Key details container.
 */
function DetailsModal(props: DetailsModalProps) {
  const { close, selectedKey } = props
  const notification = useNotification()
  const { t } = useTranslation()

  const [name, setName] = useState(selectedKey?.title)

  const { mutateAsync: updateKey } = useAdminUpdatePublishableApiKey(
    selectedKey?.id as string
  )

  useEffect(() => {
    if (selectedKey) {
      setName(selectedKey.title)
    }
  }, [selectedKey])

  const onSave = async () => {
    try {
      await updateKey({ title: name })
      close()
      notification(
        t('modals-success', 'Success'),
        t('modals-updated-the-api-key', 'Updated the API key'),
        'success'
      )
    } catch (e) {
      notification(
        t('modals-error', 'Error'),
        t(
          'modals-failed-to-update-the-api-key',
          'Failed to update the API key'
        ),
        'error'
      )
    }
  }

  return (
    <SideModal close={close} isVisible={!!selectedKey}>
      <div className="flex h-full flex-col justify-between p-6">
        {/* === HEADER === */}

        <div className="flex items-center justify-between">
          <h3 className="inter-large-semibold text-xl text-gray-900">
            {t('modals-edit-api-key-details', 'Edit API key details')}
          </h3>
          <Button variant="ghost" onClick={close}>
            <CrossIcon size={20} className="text-grey-40" />
          </Button>
        </div>
        {/* === DIVIDER === */}

        <div
          className="block h-[1px] bg-gray-200"
          style={{ margin: '24px -24px' }}
        />
        {/* === BODY === */}

        <div className="flex-grow">
          <InputField
            label={t('modals-title', 'Title')}
            type="string"
            name="name"
            value={name}
            placeholder={t('modals-name-your-key', 'Name your key')}
            onChange={({ target: { value } }) => setName(value)}
          />
        </div>
        {/* === DIVIDER === */}

        <div
          className="block h-[1px] bg-gray-200"
          style={{ margin: '24px -24px' }}
        />
        {/* === FOOTER === */}

        <div className="flex justify-end gap-2">
          <Button size="small" variant="ghost" onClick={close}>
            {t('modals-cancel', 'Cancel')}
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSave}
            disabled={name === props.selectedKey?.title}
          >
            {t('modals-save-and-close', 'Save and close')}
          </Button>
        </div>
      </div>
    </SideModal>
  )
}

export default DetailsModal
