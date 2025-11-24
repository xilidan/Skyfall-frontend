import {EyeIcon, EyeSlashIcon} from '@phosphor-icons/react'
import {useState} from 'react'
import {Button} from './Button'
import {TextField} from './TextField'

export function PasswordField(props: React.ComponentPropsWithRef<typeof TextField>) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  return (
    <TextField
      {...props}
      endContent={
        <>
          <Button
            onPress={() => {
              setPasswordVisible((prev) => !prev)
            }}
            variant="tertiary"
            isIconOnly
            className="size-auto p-1"
          >
            {passwordVisible ? <EyeIcon color="white" /> : <EyeSlashIcon color="white" />}
          </Button>

          {props.endContent}
        </>
      }
      type={passwordVisible ? 'text' : 'password'}
    />
  )
}
