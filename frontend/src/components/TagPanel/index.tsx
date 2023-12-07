import React from 'react'
import styles from './index.module.scss'

export const TagPanel = () => {

    const tagg = ['aaaa', 'derf', 'asdsadf', 'fjkdjfn', 'asdkljfh', 'adsadsa']

  return (
    <div className={styles.tags}>
        <p className={styles.title}>Most popular tags</p>
        <div className={styles.tag_container}>
            {
                // projects.map(project => <p>#{project.tags[0]}</p>)
                tagg.map(project => <p key={project}>#{project}</p>)
            }
        </div>
    </div>
  )
}
