# frozen_string_literal: true

# Validations and methods specific to Solar Charms.
class SolarCharm < Charm
  include AbilityCharm

  def entity_assoc
    'solar_charm'
  end
end
