class CreateMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :messages do |t|
      t.references :room,  foreign_key: true
      t.string :user
      t.text :message

      t.timestamps
    end
  end
end
