import IconProps from '../types/icon-type'

const EllipsisVerticalIcon = ({
  size = 20,
  color = 'currentColor',
  ...attributes
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...attributes}
    >
      <path
        d="M10 3.75C10.1989 3.75 10.3897 3.82902 10.5303 3.96967C10.671 4.11032 10.75 4.30109 10.75 4.5C10.75 4.69891 10.671 4.88968 10.5303 5.03033C10.3897 5.17098 10.1989 5.25 10 5.25C9.80109 5.25 9.61032 5.17098 9.46967 5.03033C9.32902 4.88968 9.25 4.69891 9.25 4.5C9.25 4.30109 9.32902 4.11032 9.46967 3.96967C9.61032 3.82902 9.80109 3.75 10 3.75ZM10 9.25C10.1989 9.25 10.3897 9.32902 10.5303 9.46967C10.671 9.61032 10.75 9.80109 10.75 10C10.75 10.1989 10.671 10.3897 10.5303 10.5303C10.3897 10.671 10.1989 10.75 10 10.75C9.80109 10.75 9.61032 10.671 9.46967 10.5303C9.32902 10.3897 9.25 10.1989 9.25 10C9.25 9.80109 9.32902 9.61032 9.46967 9.46967C9.61032 9.32902 9.80109 9.25 10 9.25ZM10.5303 14.9697C10.671 15.1103 10.75 15.3011 10.75 15.5C10.75 15.6989 10.671 15.8897 10.5303 16.0303C10.3897 16.171 10.1989 16.25 10 16.25C9.80109 16.25 9.61032 16.171 9.46967 16.0303C9.32902 15.8897 9.25 15.6989 9.25 15.5C9.25 15.3011 9.32902 15.1103 9.46967 14.9697C9.61032 14.829 9.80109 14.75 10 14.75C10.1989 14.75 10.3897 14.829 10.5303 14.9697Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  )
}

export default EllipsisVerticalIcon
