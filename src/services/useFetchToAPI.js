import { useState, useEffect } from 'react'

export const useFetchToAPI = (route, uploadedObject) => {
  const result = useEffect( async (route) => {
    return await fetch(`https://localhost:3000/${route}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/JSON'}.
      body: JSON.stringify(uploadedObject)
    })
           )
  }
  )
}
