# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CustomEssenceCharacter, type: :model do
  it 'has a valid factory' do
    expect(FactoryBot.create(:custom_essence_character)).to be_valid
  end
end
