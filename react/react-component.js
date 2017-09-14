/*
 Example of how organise component with bootstrap.
 Urls :
  https://www.youtube.com/watch?v=gNeavlJ7lNY
  http://style-components.com/
*/

import React from "react"
import cn from "classnames"
import "bootstrap/dist/css/bootstrap.min.css"

const App = () =>
  <div>
    <PrimaryBtn>Touch Me</PrimaryBtn>
    <DangerBtn>Don t touch Me</DangerBtn>
  </div>

const Btn = ({primary, danger, className, ...props}) => {

  const Tag = props.href ? "a" : "button"
  return <Tag
    type="button"
    className={cn(
      "btn",
      primary && "btn-primary",
      danger && "btn-danger",
      className
    )}
    {...props}
  />
}

const DangerBtn = props =>
  <Btn
    danger
    {...props}
  />

const PrimaryBtn = props =>
  <Btn
    primary
    {...props}
  />
