import { Checkbox, DatePicker, Form } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)
dayjs.extend(customParseFormat)

const CustomDatePicker = ({
  showTime = false,
  name,
  label,
  props,
  required = {},
  setState,
  state,
  showCheckbox = false,
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[required]}
      className="custom_date_picker"
    >
      <DatePicker
        showTime={showTime}
        allowClear={true}
        disabled={!state}
        className="w-full"
        {...props}
      />

      {showCheckbox &&
        <Checkbox
          checked={state}
          onChange={
            ({ target }) =>{
              if(target.checked){
                setState(true)
              }
              else{
                setState(false);
              }
            }
          }
        />
      }
    </Form.Item>
  )
}

export default CustomDatePicker
